import React, { Fragment } from "react";
import {
  VideoOffIcon,
  VideoOnIcon,
  MicOffIcon,
  MicOnIcon,
} from "@100mslive/react-icons";
import { Tooltip, IconButton } from "@100mslive/react-ui";
import { useAVToggle } from "@100mslive/react-sdk";

export const AudioVideoToggle = () => {
  const {
    isAllowedToPublish,
    isLocalVideoEnabled,
    isLocalAudioEnabled,
    toggleAudio,
    toggleVideo,
  } = useAVToggle();
  return (
    <Fragment>
      {isAllowedToPublish.audio ? (
        <Tooltip title={`Turn ${isLocalAudioEnabled ? "off" : "on"} audio`}>
          <IconButton
            className="mx-2"
            active={isLocalAudioEnabled}
            onClick={toggleAudio}
            key="toggleAudio"
          >
            {!isLocalAudioEnabled ? <MicOffIcon /> : <MicOnIcon />}
          </IconButton>
        </Tooltip>
      ) : null}
      {isAllowedToPublish.video ? (
        <Tooltip title={`Turn ${isLocalVideoEnabled ? "off" : "on"} video`}>
          <IconButton
            className="mx-2"
            key="toggleVideo"
            active={isLocalVideoEnabled}
            onClick={toggleVideo}
          >
            {!isLocalVideoEnabled ? <VideoOffIcon /> : <VideoOnIcon />}
          </IconButton>
        </Tooltip>
      ) : null}
    </Fragment>
  );
};
