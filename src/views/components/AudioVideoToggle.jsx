import React, { Fragment } from "react";
import {
  VideoOffIcon,
  VideoOnIcon,
  MicOffIcon,
  MicOnIcon,
} from "@100mslive/react-icons";
import { Tooltip, IconButton } from "@100mslive/react-ui";
import { useAVToggle } from "@100mslive/react-sdk";

export const AudioVideoToggle = ({ compact = false }) => {
  const { isLocalVideoEnabled, isLocalAudioEnabled, toggleAudio, toggleVideo } =
    useAVToggle();
  return (
    <Fragment>
      {toggleAudio ? (
        <Tooltip title={`Turn ${isLocalAudioEnabled ? "off" : "on"} audio`}>
          <IconButton
            css={{ mr: compact ? "$2" : "$4" }}
            active={isLocalAudioEnabled}
            onClick={toggleAudio}
            key="toggleAudio"
          >
            {!isLocalAudioEnabled ? <MicOffIcon /> : <MicOnIcon />}
          </IconButton>
        </Tooltip>
      ) : null}
      {toggleVideo ? (
        <Tooltip title={`Turn ${isLocalVideoEnabled ? "off" : "on"} video`}>
          <IconButton
            css={compact ? { ml: "$2" } : { mx: "$4" }}
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
