import React, { useState, useCallback, useContext, useRef } from "react";
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
  isMobileDevice,
  selectIsAllowedToPublish,
  selectIsLocalVideoPluginPresent,
} from "@100mslive/hms-video-react";
import { useHistory, useParams } from "react-router-dom";
import { HMSVirtualBackgroundPlugin } from "@100mslive/hms-virtual-background";
import { getRandomVirtualBackground } from "../common/utils";
import { AppContext } from "../store/AppContext";

const SettingsView = () => {
  const { setMaxTileCount, maxTileCount } = useContext(AppContext);

  const onChange = count => {
    setMaxTileCount(count);
  };
  return (
    <>
      <Settings
        onTileCountChange={onChange}
        maxTileCount={maxTileCount}
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
  const isVBPresent = useHMSStore(
    selectIsLocalVideoPluginPresent("@100mslive/hms-virtual-background")
  );
  const hmsActions = useHMSActions();
  const { isConnected, leave } = useContext(AppContext);
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

  async function startPlugin() {
    if (!pluginRef.current) {
      pluginRef.current = new HMSVirtualBackgroundPlugin("none");
    }
    await pluginRef.current.setBackground(getRandomVirtualBackground());
    await hmsActions.addPluginToVideoTrack(pluginRef.current);
  }

  async function removePlugin() {
    if (pluginRef.current) {
      await hmsActions.removePluginFromVideoTrack(pluginRef.current);
      pluginRef.current = null;
    }
  }

  function handleVirtualBackground() {
    isVBPresent ? removePlugin() : startPlugin();
  }

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
              active={isVBPresent}
              onClick={handleVirtualBackground}
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
        backgroundButtonOnClick={handleVirtualBackground}
        isAudioMuted={!isLocalAudioEnabled}
        isVideoMuted={!isLocalVideoEnabled}
        isBackgroundEnabled={isVBPresent}
      />
      <MessageModal
        {...errorModal}
        onClose={() => setErrorModal(initialModalProps)}
      />
    </>
  ) : null;
};
