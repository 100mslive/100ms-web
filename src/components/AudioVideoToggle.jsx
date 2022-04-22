import React, { Fragment } from "react";
import {
  VideoOffIcon,
  VideoOnIcon,
  MicOffIcon,
  MicOnIcon,
} from "@100mslive/react-icons";
import { Tooltip, IconButton } from "@100mslive/react-ui";
import { useAVToggle, parsedUserAgent } from "@100mslive/react-sdk";

const isMacOS = parsedUserAgent.getOS().name.toLowerCase() === "mac os";

export const AudioVideoToggle = ({ compact = false, isAudioOnly }) => {
  const { isLocalVideoEnabled, isLocalAudioEnabled, toggleAudio, toggleVideo } =
    useAVToggle();
  return (
    <Fragment>
      {toggleAudio ? (
        <Tooltip
          title={`Turn ${isLocalAudioEnabled ? "off" : "on"} audio (${
            isMacOS ? "⌘" : "ctrl"
          } + d)`}
        >
          <IconButton
            css={{ mr: compact ? "$2" : "$4" }}
            active={isLocalAudioEnabled}
            onClick={toggleAudio}
            key="toggleAudio"
            data-testid="audio_btn"
          >
            {!isLocalAudioEnabled ? (
              <MicOffIcon data-testid="audio_off_btn" />
            ) : (
              <MicOnIcon data-testid="audio_on_btn" />
            )}
          </IconButton>
        </Tooltip>
      ) : null}
      {toggleVideo ? (
        <Tooltip
          title={`Turn ${isLocalVideoEnabled ? "off" : "on"} video (${
            isMacOS ? "⌘" : "ctrl"
          } + e)`}
        >
          <IconButton
            css={compact ? { ml: "$2" } : { mx: "$4" }}
            key="toggleVideo"
            active={isLocalVideoEnabled}
            disabled={isAudioOnly}
            onClick={toggleVideo}
            data-testid="video_btn"
          >
            {!isLocalVideoEnabled ? (
              <VideoOffIcon data-testid="video_off_btn" />
            ) : (
              <VideoOnIcon data-testid="video_on_btn" />
            )}
          </IconButton>
        </Tooltip>
      ) : null}
    </Fragment>
  );
};
