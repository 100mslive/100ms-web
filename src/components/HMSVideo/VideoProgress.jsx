import { useEffect, useRef, useState } from "react";
import { Box, Flex } from "@100mslive/react-ui";
import { getPercentage } from "./HMSVIdeoUtils";

export const VideoProgress = ({ onValueChange, videoRef }) => {
  const [videoProgress, setVideoProgress] = useState(0);
  const [bufferProgress, setBufferProgress] = useState(0);
  const progressRootRef = useRef();

  useEffect(() => {
    const videoEl = videoRef.current;
    const timeupdateHandler = () => {
      const videoProgress = Math.floor(
        getPercentage(videoEl.currentTime, videoEl.duration)
      );
      let bufferProgress = 0;
      if (videoEl.buffered.length > 0) {
        bufferProgress = Math.floor(
          getPercentage(videoEl.buffered?.end(0), videoEl.duration)
        );
      }

      setVideoProgress(isNaN(videoProgress) ? 0 : videoProgress);
      setBufferProgress(isNaN(bufferProgress) ? 0 : bufferProgress);
    };
    if (videoEl) {
      videoEl.addEventListener("timeupdate", timeupdateHandler);
    }
    return function cleanup() {
      if (videoEl) {
        videoEl.removeEventListener("timeupdate", timeupdateHandler);
      }
    };
  }, []);

  const onProgressChangeHandler = e => {
    const userClickedX = e.clientX - progressRootRef.current.offsetLeft;
    const progressBarWidth = progressRootRef.current.offsetWidth;
    const progress = Math.floor(getPercentage(userClickedX, progressBarWidth));
    const videoEl = videoRef.current;
    const currentTime = (progress * videoEl.duration) / 100;

    videoEl.currentTime = currentTime;
    if (onValueChange) {
      onValueChange(currentTime);
    }
  };

  return videoRef.current ? (
    <Flex
      ref={progressRootRef}
      css={{ paddingLeft: "$8", paddingRight: "$8", cursor: "pointer" }}
      onClick={onProgressChangeHandler}
    >
      <Box
        id="video-actual"
        css={{
          display: "inline",
          width: `${videoProgress}%`,
          background: "$primaryDefault",
          height: "0.3rem",
        }}
      />
      <Box
        id="video-buffer"
        css={{
          width: `${bufferProgress - videoProgress}%`,
          background: "$primaryDark",
          height: "0.3rem",
        }}
      />
      <Box
        id="video-rest"
        css={{
          width: `${100 - bufferProgress}%`,
          background: "$grayLight",
          height: "0.3rem",
        }}
      />
    </Flex>
  ) : null;
};
