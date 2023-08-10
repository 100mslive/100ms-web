import React, { Fragment, useState } from "react";
import { useScreenShare } from "@100mslive/react-sdk";
import { ScreenShareHintModal } from "../ScreenshareHintModal";
import { WidgetCard } from "./WidgetCard";
import { useWidgetToggle } from "../AppData/useSidepane";
import { useShowAudioShare } from "../AppData/useUISettings";

export const ScreenshareAudio = () => {
  const {
    amIScreenSharing,
    screenShareVideoTrackId: video,
    screenShareAudioTrackId: audio,
    toggleScreenShare,
  } = useScreenShare();
  const isAudioScreenshare = amIScreenSharing && !video && !!audio;
  const [showModal, setShowModal] = useState(false);
  const { showAudioShare } = useShowAudioShare();
  const toggleWidget = useWidgetToggle();

  if (!showAudioShare) {
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
        <ScreenShareHintModal
          onClose={() => {
            setShowModal(false);
            toggleWidget();
          }}
        />
      )}
    </Fragment>
  );
};
