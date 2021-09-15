import React, { useEffect, useState } from "react";
import {
  Button,
  selectRemotePeers,
  selectTracksMap,
  useHMSActions,
  useHMSStore,
} from "@100mslive/hms-video-react";

const drawImageCanvas = (videoTracks, canvas) => {
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

  let tilesToShow = numberOfParticipants > 6 ? 6 : numberOfParticipants;
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
  const fps = 30;

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 600;
    window.pip_canvas = canvas;

    const pipVideo = document.createElement("video");
    pipVideo.srcObject = canvas.captureStream();
    window.pip_video = pipVideo;

    pipVideo.addEventListener(
      "leavepictureinpicture",
      () => {
        console.log("leave callback");
        setIsPipOn(false);
        clearInterval(window.canvas_interval);
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

    if (!!document.pictureInPictureElement) {
      clearInterval(window.canvas_interval);
      window.canvas_interval = window.setInterval(() => {
        drawImageCanvas(videoElements, canvas);
      }, 1000 / fps);
      // await pipVideo.play();
      return;
    }

    if (isPipOn) {
      clearInterval(window.canvas_interval);
      window.canvas_interval = window.setInterval(() => {
        drawImageCanvas(videoElements, canvas);
      }, 1000 / fps);
      await pipVideo.play();
      pipVideo.requestPictureInPicture();
    }
  }, [remotePeers, tracksMap, isPipOn]);

  const togglePIP = () => {
    if (!isPipOn) {
      setIsPipOn(true);
      // createAndDrawOnCanvas(videoTracks, 30, canvasInterval, setIsPipOn);
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
