import React, { useEffect, useState } from "react";
import {
  Button,
  selectRemotePeers,
  selectTracksMap,
  useHMSActions,
  useHMSStore,
  PIPIcon,
} from "@100mslive/hms-video-react";
import * as workerTimers from "worker-timers";

import { hmsToast } from "./components/notifications/hms-toast";

import { MAX_NUMBER_OF_TILES_IN_PIP, PIP_FPS as FPS } from "../common/utils";

const drawImageOnCanvas = (videoTracks, canvas) => {
  const numberOfParticipants = videoTracks.length;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000000";
  const w = canvas.width;
  const h = canvas.height;
  if (numberOfParticipants === 0) {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return;
  } else if (numberOfParticipants === 1) {
    ctx.drawImage(videoTracks[0], 0, 0, w, h);
    return;
  }

  let tilesToShow =
    numberOfParticipants > MAX_NUMBER_OF_TILES_IN_PIP
      ? MAX_NUMBER_OF_TILES_IN_PIP
      : numberOfParticipants;
  const evenTiles = tilesToShow % 2 === 0 ? tilesToShow : tilesToShow - 1;
  tilesToShow = tilesToShow % 2 === 0 ? tilesToShow : Number(tilesToShow) + 1;

  const tilesW = w / 2;
  const tilesH = h / (tilesToShow / 2);
  let startX = 0,
    startY = 0;
  let trackNumber = 0;
  for (; trackNumber < evenTiles; trackNumber += 2) {
    ctx.drawImage(videoTracks[trackNumber], startX, startY, tilesW, tilesH);
    ctx.drawImage(
      videoTracks[trackNumber + 1],
      startX + tilesW,
      startY,
      tilesW,
      tilesH
    );
    startY += tilesH;
  }

  if (tilesToShow !== evenTiles) {
    ctx.drawImage(videoTracks[trackNumber], startX, startY, tilesW, tilesH);
    ctx.fillRect(startX + tilesW, startY, tilesW, tilesH);
  }
};

const PIP = () => {
  const [isPipOn, setIsPipOn] = useState(!!document.pictureInPictureElement);
  const hmsActions = useHMSActions();
  const tracksMap = useHMSStore(selectTracksMap);
  const remotePeers = useHMSStore(selectRemotePeers);

  useEffect(() => {
    // new canvas element
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 600;

    // new video element with src from canvas stream
    const pipVideo = document.createElement("video");
    pipVideo.srcObject = canvas.captureStream();

    window.pip = {
      video: pipVideo,
      canvas: canvas,
      canvasInterval: null,
    };

    const leavePIPEventListener = () => {
      setIsPipOn(false);
      workerTimers.clearInterval(window.pip.canvasInterval);
    };

    pipVideo.addEventListener(
      "leavepictureinpicture",
      leavePIPEventListener,
      false
    );
    //cleanup
    return () => {
      pipVideo.removeEventListener(
        "leavepictureinpicture",
        leavePIPEventListener,
        false
      );
    };
  }, []);

  useEffect(() => {
    const canvas = window.pip.canvas;
    const pipVideo = window.pip.video;

    const playVideoAndRequestPIP = async () => {
      await pipVideo.play();
      pipVideo.requestPictureInPicture();
    };

    const attachHMSVideo = async (trackID, videoElement) => {
      await hmsActions.attachVideo(trackID, videoElement);
    };

    let videoElements = [];
    for (const peer of remotePeers) {
      const track = tracksMap[peer.videoTrack];
      if (track && track.enabled === true && track.displayEnabled === true) {
        const videoElement = document.createElement("video");
        videoElement.autoplay = true;
        videoElement.playsinline = true;
        try {
          attachHMSVideo(track.id, videoElement);
        } catch (error) {
          hmsToast(error.message);
        }
        videoElements.push(videoElement);
      }
    }

    /**
     * If PIP element is already present then peers might have changed, so rendering the
     * new peer video tiles along with others.
     */

    if (!!document.pictureInPictureElement) {
      workerTimers.clearInterval(window.pip.canvasInterval);
      window.pip.canvasInterval = workerTimers.setInterval(() => {
        drawImageOnCanvas(videoElements, canvas);
      }, 1000 / FPS);
      return;
    }

    /**
     * isPipOn is toggled only by the PIP button in UI and "leavepictureinpicture" event.
     * If isPipOn is true then we have to request for PIP element.
     */
    if (isPipOn) {
      window.pip.canvasInterval = workerTimers.setInterval(() => {
        drawImageOnCanvas(videoElements, canvas);
      }, 1000 / FPS);

      try {
        playVideoAndRequestPIP();
      } catch (error) {
        hmsToast(error.message);
        setIsPipOn(false);
      }
    }
  }, [remotePeers, tracksMap, isPipOn]);

  const togglePIP = () => {
    if (!isPipOn) {
      setIsPipOn(true);
    } else {
      document.exitPictureInPicture();
      setIsPipOn(false);
    }
  };

  return (
    <Button
      variant="no-fill"
      iconSize="md"
      shape="rectangle"
      key="pip"
      onClick={togglePIP}
    >
      <PIPIcon />
    </Button>
  );
};

export default PIP;
