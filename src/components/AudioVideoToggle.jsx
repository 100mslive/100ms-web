import React, { Fragment } from "react";
import {
  selectIsConnectedToRoom,
  selectLocalVideoTrackID,
  selectVideoTrackByID,
  useAVToggle,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import {
  CameraFlipIcon,
  MicOffIcon,
  MicOnIcon,
  VideoOffIcon,
  VideoOnIcon,
} from "@100mslive/react-icons";
import { Tooltip } from "@100mslive/roomkit-react";
import { ToastManager } from "./Toast/ToastManager";
import IconButton from "../IconButton";
import { isMacOS } from "../common/constants";

export const AudioVideoToggle = () => {
  const { isLocalVideoEnabled, isLocalAudioEnabled, toggleAudio, toggleVideo } =
    useAVToggle();
  const actions = useHMSActions();
  const videoTracKId = useHMSStore(selectLocalVideoTrackID);
  const localVideoTrack = useHMSStore(selectVideoTrackByID(videoTracKId));
  const isConnectedToRoom = useHMSStore(selectIsConnectedToRoom);

  return (
    <Fragment>
      {toggleAudio ? (
        <Tooltip
          title={`Turn ${isLocalAudioEnabled ? "off" : "on"} audio (${
            isMacOS ? "⌘" : "ctrl"
          } + d)`}
        >
          <IconButton
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
            key="toggleVideo"
            active={isLocalVideoEnabled}
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
      {localVideoTrack?.facingMode && isConnectedToRoom ? (
        <Tooltip title="Switch Camera" key="switchCamera">
          <IconButton
            onClick={async () => {
              try {
                await actions.switchCamera();
              } catch (e) {
                ToastManager.addToast({
                  title: `Error while flipping camera ${e.message || ""}`,
                  variant: "error",
                });
              }
            }}
          >
            <CameraFlipIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </Fragment>
  );
};
