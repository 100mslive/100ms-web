import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import {
  useHMSStore,
  ControlBar,
  HangUpIcon,
  MicOffIcon,
  MicOnIcon,
  CamOffIcon,
  CamOnIcon,
  VirtualBackgroundIcon,
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
  isMobileDevice,
  selectIsAllowedToPublish,
} from "@100mslive/hms-video-react";
import { useHistory, useParams } from "react-router-dom";
import { HMSVirtualBackgroundPlugin } from "@100mslive/hms-virtual-background";
import { AppContext } from "../store/AppContext";

const SettingsView = () => {
  const hmsActions = useHMSActions();
  const { setMaxTileCount } = useContext(AppContext);
  const { audioInputDeviceId, videoInputDeviceId, audioOutputDeviceId } =
    useHMSStore(selectLocalMediaSettings);

  const onChange = ({
    maxTileCount: newMaxTileCount,
    selectedVideoInput: newSelectedVideoInput,
    selectedAudioInput: newSelectedAudioInput,
    selectedAudioOutput: newSelectedAudioOuput,
  }) => {
    setMaxTileCount(newMaxTileCount);
    if (audioInputDeviceId !== newSelectedAudioInput) {
      hmsActions.setAudioSettings({ deviceId: newSelectedAudioInput });
    }

    if (videoInputDeviceId !== newSelectedVideoInput) {
      hmsActions.setVideoSettings({ deviceId: newSelectedVideoInput });
    }

    if (audioOutputDeviceId !== newSelectedAudioOuput) {
      hmsActions.setAudioOutputDevice(newSelectedAudioOuput);
    }
  };
  return (
    <>
      <Settings
        onChange={onChange}
        classes={{ sliderContainer: "hidden md:block", root: "mr-2 md:mr-0" }}
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
  const [showBackground, setShowBackground] = useState(false);
  const history = useHistory();
  const params = useParams();
  const pluginRef = useRef(null);
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);

  const initialModalProps = {
    show: false,
    title: "",
    body: "",
  };
  const [errorModal, setErrorModal] = useState(initialModalProps);

  useEffect(() => {
    async function startPlugin() {
      if (!pluginRef.current) {
        pluginRef.current = new HMSVirtualBackgroundPlugin("blur");
      }
      await hmsActions.addPluginToVideoTrack(pluginRef.current);
    }
    async function removePlugin() {
      if (pluginRef.current) {
        await hmsActions.removePluginFromVideoTrack(pluginRef.current);
      }
    }
    if (showBackground) {
      startPlugin();
    } else {
      removePlugin();
    }
  }, [showBackground]); //eslint-disable-line

  const toggleAudio = useCallback(async () => {
    try {
      await hmsActions.setLocalAudioEnabled(!isLocalAudioEnabled);
    } catch (err) {
      console.error("Cannot toggle audio", err);
    }
  }, [hmsActions, isLocalAudioEnabled]);

  const toggleVideo = useCallback(async () => {
    try {
      await hmsActions.setLocalVideoEnabled(!isLocalVideoEnabled);
    } catch (err) {
      console.error("Cannot toggle video", err);
    }
  }, [hmsActions, isLocalVideoEnabled]);

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
    leftComponents.push(<VerticalDivider key={1} />);
    if (isAllowedToPublish.screen) {
      leftComponents.push(
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
        <VerticalDivider key={3} />
      );
    }
    leftComponents.push(
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
      </Button>
    );
  }

  return isConnected ? (
    <>
      <ControlBar
        leftComponents={leftComponents}
        centerComponents={[
          isAllowedToPublish.audio ? (
            <Button
              iconOnly
              variant="no-fill"
              iconSize="md"
              classes={{ root: "mr-2" }}
              shape="rectangle"
              active={!isLocalAudioEnabled}
              onClick={toggleAudio}
              key={0}
            >
              {!isLocalAudioEnabled ? <MicOffIcon /> : <MicOnIcon />}
            </Button>
          ) : null,
          isAllowedToPublish.video ? (
            <Button
              iconOnly
              variant="no-fill"
              iconSize="md"
              classes={{ root: "mr-2" }}
              shape="rectangle"
              active={!isLocalVideoEnabled}
              onClick={toggleVideo}
              key={1}
            >
              {!isLocalVideoEnabled ? <CamOffIcon /> : <CamOnIcon />}
            </Button>
          ) : null,
          isAllowedToPublish.video ? (
            <Button
              iconOnly
              variant="no-fill"
              shape="rectangle"
              active={showBackground}
              onClick={() => setShowBackground(!showBackground)}
              key={2}
            >
              <VirtualBackgroundIcon />
            </Button>
          ) : null,
        ]}
        rightComponents={[
          <Button
            key={0}
            size="md"
            shape="rectangle"
            variant="danger"
            onClick={() => {
              leave();
              if (params.role)
                history.push("/leave/" + params.roomId + "/" + params.role);
              else history.push("/leave/" + params.roomId);
            }}
          >
            <HangUpIcon className="mr-2" />
            Leave room
          </Button>,
        ]}
        audioButtonOnClick={toggleAudio}
        videoButtonOnClick={toggleVideo}
        backgroundButtonOnClick={() => setShowBackground(!showBackground)}
        isAudioMuted={!isLocalAudioEnabled}
        isVideoMuted={!isLocalVideoEnabled}
        isBackgroundEnabled={showBackground}
      />
      <MessageModal
        {...errorModal}
        onClose={() => setErrorModal(initialModalProps)}
      />
    </>
  ) : null;
};
