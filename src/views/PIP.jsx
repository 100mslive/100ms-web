import React, { useEffect, useState } from "react";
import {
  Button,
  selectRemotePeers,
  selectTracksMap,
  useHMSActions,
  useHMSStore,
} from "@100mslive/hms-video-react";
import * as workerTimers from "worker-timers";

const MAX_NUMBER_OF_TILES_IN_PIP = 4;

const drawImageOnCanvas = (videoTracks, canvas) => {
  const numberOfParticipants = videoTracks.length;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000000";
  let w = canvas.width;
  let h = canvas.height;
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
  let evenTiles = tilesToShow % 2 === 0 ? tilesToShow : tilesToShow - 1;
  tilesToShow = tilesToShow % 2 === 0 ? tilesToShow : Number(tilesToShow) + 1;

  let tilesW = w / 2;
  let tilesH = h / (tilesToShow / 2);
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
  const FPS = 30;

  useEffect(() => {
    // new canvas element
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 600;
    window.pip_canvas = canvas;

    // new video element with src from canvas stream
    const pipVideo = document.createElement("video");
    pipVideo.srcObject = canvas.captureStream();
    window.pip_video = pipVideo;

    window.canvas_interval = null;

    pipVideo.addEventListener(
      "leavepictureinpicture",
      () => {
        console.log("leave callback");
        setIsPipOn(false);
        workerTimers.clearInterval(window.canvas_interval);
      },
      false
    );
  }, []);

  useEffect(async () => {
    const canvas = window.pip_canvas;
    const pipVideo = window.pip_video;

    let videoElements = [];
    for (let i = 0; i < remotePeers.length; i++) {
      let peer = remotePeers[i];
      let track = tracksMap[peer.videoTrack];
      if (track && track.enabled === true && track.displayEnabled === true) {
        const videoElement = document.createElement("video");
        videoElement.autoplay = true;
        videoElement.playsinline = true;
        hmsActions.attachVideo(track.id, videoElement);
        videoElements.push(videoElement);
      }
    }

    /**
     * If PIP element is already present then peers might have changed, so rendering the
     * new peer video tiles along with others.
     */

    if (!!document.pictureInPictureElement) {
      workerTimers.clearInterval(window.canvas_interval);
      window.canvas_interval = workerTimers.setInterval(() => {
        drawImageOnCanvas(videoElements, canvas);
      }, 1000 / FPS);
      return;
    }

    /**
     * isPipOn is toggled only by the PIP button in UI and "leavepictureinpicture" event.
     * If isPipOn is true then we have to request for PIP element.
     */
    if (isPipOn) {
      window.canvas_interval = workerTimers.setInterval(() => {
        drawImageOnCanvas(videoElements, canvas);
      }, 1000 / FPS);
      await pipVideo.play();
      pipVideo.requestPictureInPicture();
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
      key="pip"
      variant="no-fill"
      shape="rectangle"
      onClick={() => togglePIP()}
    >
      PIP
    </Button>
  );
};

export default PIP;
