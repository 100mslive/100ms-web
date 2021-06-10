import React, { useState } from "react";
import {
  useHMSStore,
  ControlBar,
  HangUpIcon,
  Button,
  ShareScreenIcon,
  ChatIcon,
  ChatUnreadIcon,
  VerticalDivider,
  MessageModal,
  useHMSActions,
  selectIsLocalScreenShared,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoDisplayEnabled,
  selectUnreadHMSMessagesCount,
  selectLocalMediaSettings,
} from "@100mslive/hms-video-react";
import { useContext, useCallback } from "react";
import { AppContext } from "../store/AppContext";
import { useHistory, useParams } from "react-router-dom";
import { Settings } from "@100mslive/hms-video-react";

const SettingsView = () => {
  const hmsActions = useHMSActions();
  const { setMaxTileCount } = useContext(AppContext);
  const { audioInputDeviceId, videoInputDeviceId } = useHMSStore(
    selectLocalMediaSettings
  );

  const onChange = ({
    maxTileCount: newMaxTileCount,
    selectedVideoInput: newSelectedVideoInput,
    selectedAudioInput: newSelectedAudioInput,
  }) => {
    setMaxTileCount(newMaxTileCount);
    if (audioInputDeviceId !== newSelectedAudioInput) {
      hmsActions.setAudioSettings({ deviceId: newSelectedAudioInput });
    }

    if (videoInputDeviceId !== newSelectedVideoInput) {
      hmsActions.setVideoSettings({ deviceId: newSelectedVideoInput });
    }
  };
  return (
    <>
      <Settings onChange={onChange} />
    </>
  );
};

export const ConferenceFooter = ({ isChatOpen, toggleChat }) => {
  const isScreenShared = useHMSStore(selectIsLocalScreenShared);
  const isLocalAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoDisplayEnabled);
  const countUnreadMessages = useHMSStore(selectUnreadHMSMessagesCount);
  const hmsActions = useHMSActions();
  const { isConnected, leave } = useContext(AppContext);
  const history = useHistory();
  const params = useParams();

  const initialModalProps = {
    show: false,
    title: "",
    body: "",
  };
  const [errorModal, setErrorModal] = useState(initialModalProps);

  const toggleScreenShare = useCallback(async () => {
    try {
      await hmsActions.setScreenShareEnabled(!isScreenShared);
    } catch (error) {
      if (error.description.includes("denied by system")) {
        setErrorModal({
          show: true,
          title: "Screen share permission denied by OS",
          body: "Please update your OS settings to permit screen share.",
        });
      }
    }
  }, [hmsActions, isScreenShared]);

  return isConnected ? (
    <>
      <ControlBar
        leftComponents={[
          <SettingsView key={0} />,
          <VerticalDivider key={1} />,
          <Button
            key={2}
            iconOnly
            variant={"no-fill"}
            iconSize="md"
            shape={"rectangle"}
            onClick={toggleScreenShare}
          >
            <ShareScreenIcon />
          </Button>,
          <VerticalDivider key={3} />,
          <Button
            key={4}
            iconOnly
            variant={"no-fill"}
            iconSize="md"
            shape={"rectangle"}
            onClick={toggleChat}
            active={isChatOpen}
          >
            {countUnreadMessages === 0 ? <ChatIcon /> : <ChatUnreadIcon />}
          </Button>,
        ]}
        rightComponents={[
          <Button
            key={0}
            size="md"
            shape={"rectangle"}
            variant={"danger"}
            onClick={() => {
              leave();
              history.push("/leave/" + params.roomId + "/" + params.role);
            }}
          >
            <HangUpIcon className="mr-2" />
            Leave room
          </Button>,
        ]}
        audioButtonOnClick={() =>
          hmsActions.setLocalAudioEnabled(!isLocalAudioEnabled)
        }
        videoButtonOnClick={() =>
          hmsActions.setLocalVideoEnabled(!isLocalVideoEnabled)
        }
        isAudioMuted={!isLocalAudioEnabled}
        isVideoMuted={!isLocalVideoEnabled}
      />
      <MessageModal
        {...errorModal}
        onClose={() => setErrorModal(initialModalProps)}
      />
    </>
  ) : null;
};
