import React, { Fragment, useState } from "react";
import {
  selectIsAllowedToPublish,
  useHMSStore,
  useScreenShare,
} from "@100mslive/react-sdk";
import { ScreenShareHintModal } from "../ScreenshareHintModal";
import { WidgetCard } from "./WidgetCard";
import { useIsFeatureEnabled } from "../hooks/useFeatures";
import { isScreenshareSupported } from "../../common/utils";
import { FEATURE_LIST } from "../../common/constants";

export const ScreenshareAudio = () => {
  const {
    amIScreenSharing,
    screenShareVideoTrackId: video,
    screenShareAudioTrackId: audio,
    toggleScreenShare,
  } = useScreenShare();
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const isAudioScreenshare = amIScreenSharing && !video && !!audio;
  const [showModal, setShowModal] = useState(false);
  const isFeatureEnabled = useIsFeatureEnabled(
    FEATURE_LIST.AUDIO_ONLY_SCREENSHARE
  );
  if (
    !isFeatureEnabled ||
    !isAllowedToPublish.screen ||
    !isScreenshareSupported()
  ) {
    return null;
  }
  return (
    <Fragment>
      <WidgetCard
        title={!isAudioScreenshare ? "Share music" : "Stop sharing music"}
        subtitle={`${
          !isAudioScreenshare ? "Play music" : "Stop playing music"
        } music from Spotify or any other tab`}
        imageSrc={require("../../images/audio.png")}
        onClick={() => {
          if (amIScreenSharing) {
            toggleScreenShare();
          } else {
            setShowModal(true);
          }
        }}
      />
      {showModal && (
        <ScreenShareHintModal onClose={() => setShowModal(false)} />
      )}
    </Fragment>
  );
};
