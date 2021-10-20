import React, { useEffect, useState } from "react";
import {
  Button,
  PIPIcon,
  selectRemotePeers,
  selectTracksMap,
  useHMSActions,
  useHMSStore,
} from "@100mslive/hms-video-react";
import * as workerTimers from "worker-timers";

import { hmsToast } from "../components/notifications/hms-toast";

import { PIP_FPS as FPS } from "../../common/constants";
import { drawImageOnCanvas } from "./pipUtils";

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

    /**
     * Create a videoElements Array for the video elements of each remote peer.
     */
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
     * If PIP element is already present then either peers or their tracks might have changed, so rendering the
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
