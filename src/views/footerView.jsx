import React, { useState, useCallback, useContext } from "react";
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
  Settings,
  selectIsLocalScreenShared,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoDisplayEnabled,
  selectUnreadHMSMessagesCount,
  selectLocalMediaSettings,
} from "@100mslive/hms-video-react";
import { useHistory, useParams } from "react-router-dom";
import { AppContext } from "../store/AppContext";
import { isMobileDevice } from "../common/utils";

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
      <Settings
        onChange={onChange}
        classes={{ sliderContainer: "hidden md:block" }}
      />
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

  const leftComponents = [<SettingsView key={0} />];

  if (!isMobileDevice()) {
    leftComponents.push(
      ...[
        <VerticalDivider key={1} />,
        <Button
          key={2}
          iconOnly
          variant="no-fill"
          iconSize="md"
          shape="rectangle"
          onClick={toggleScreenShare}
        >
          <ShareScreenIcon />
        </Button>,
        <VerticalDivider key={3} />,
        <Button
          key={4}
          iconOnly
          variant="no-fill"
          iconSize="md"
          shape="rectangle"
          onClick={toggleChat}
          active={isChatOpen}
        >
          {countUnreadMessages === 0 ? <ChatIcon /> : <ChatUnreadIcon />}
        </Button>,
      ]
    );
  }

  return isConnected ? (
    <>
      <ControlBar
        leftComponents={leftComponents}
        rightComponents={[
          <Button
            key={0}
            size="md"
            shape="rectangle"
            variant="danger"
            onClick={() => {
              leave();
              if (params.role) history.push("/leave/" + params.roomId + "/" + params.role);
              else history.push("/leave/" + params.roomId);
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
