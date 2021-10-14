import {
  Button,
  CamOffIcon,
  CamOnIcon,
  MicOffIcon,
  MicOnIcon,
  selectIsAllowedToPublish,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoDisplayEnabled,
  useHMSActions,
  useHMSStore,
} from "@100mslive/hms-video-react";
import React, { Fragment, useCallback } from "react";

export const AudioVideoToggle = () => {
  const isLocalAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoDisplayEnabled);
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const hmsActions = useHMSActions();

  const toggleAudio = useCallback(async () => {
    try {
      await hmsActions.setLocalAudioEnabled(!isLocalAudioEnabled);
    } catch (err) {
      console.error("Cannot toggle audio", err);
    }
  }, [isLocalAudioEnabled]); //eslint-disable-line

  const toggleVideo = useCallback(async () => {
    try {
      await hmsActions.setLocalVideoEnabled(!isLocalVideoEnabled);
    } catch (err) {
      console.error("Cannot toggle video", err);
    }
  }, [isLocalVideoEnabled]); //eslint-disable-line

  return (
    <Fragment>
      {isAllowedToPublish.audio ? (
        <Button
          iconOnly
          variant="no-fill"
          iconSize="md"
          classes={{ root: "mx-2" }}
          shape="rectangle"
          active={!isLocalAudioEnabled}
          onClick={toggleAudio}
          key="toggleAudio"
        >
          {!isLocalAudioEnabled ? <MicOffIcon /> : <MicOnIcon />}
        </Button>
      ) : null}
      {isAllowedToPublish.video ? (
        <Button
          iconOnly
          variant="no-fill"
          iconSize="md"
          classes={{ root: "mx-2" }}
          shape="rectangle"
          active={!isLocalVideoEnabled}
          onClick={toggleVideo}
          key="toggleVideo"
        >
          {!isLocalVideoEnabled ? <CamOffIcon /> : <CamOnIcon />}
        </Button>
      ) : null}
    </Fragment>
  );
};
