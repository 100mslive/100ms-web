import { useEffect, useState } from "react";
import { Text } from "@100mslive/react-ui";
import { getDurationFromSeconds } from "./HMSVIdeoUtils";

export const VideoTime = ({ videoRef }) => {
  const [videoTime, setVideoTime] = useState("");

  useEffect(() => {
    const videoEl = videoRef.current;
    const timeupdateHandler = _ =>
      setVideoTime(getDurationFromSeconds(videoEl.currentTime));
    if (videoEl) {
      videoEl.addEventListener("timeupdate", timeupdateHandler);
    }
    return function cleanup() {
      if (videoEl) {
        videoEl.removeEventListener("timeupdate", timeupdateHandler);
      }
    };
  }, []);

  return videoRef.current ? (
    <Text
      variant={{
        "@sm": "xs",
      }}
    >{`${videoTime}`}</Text>
  ) : null;
};
