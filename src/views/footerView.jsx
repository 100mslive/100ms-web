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
  selectPermissions,
} from "@100mslive/hms-video-react";
import { useHistory, useParams } from "react-router-dom";
import { HMSVirtualBackgroundPlugin } from "@100mslive/hms-virtual-background";
import { AppContext } from "../store/AppContext";
import { getRandomVirtualBackground } from "../common/utils";

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
  const permissions = useHMSStore(selectPermissions);
  const [showEndRoomModal, setShowEndRoomModal] = useState(false);
  const [lockRoom, setLockRoom] = useState(false);

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
    //Running VB on every alternate frame rate for optimized cpu usage
    await hmsActions.addPluginToVideoTrack(pluginRef.current, 15);
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

  function redirectToLeave() {
    if (params.role) {
      history.push("/leave/" + params.roomId + "/" + params.role);
    } else {
      history.push("/leave/" + params.roomId);
    }
  }

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
          permissions?.endRoom ? (
            <Button
              key={1}
              size="md"
              shape="rectangle"
              variant="danger"
              classes={{ root: "mr-2" }}
              onClick={() => {
                setShowEndRoomModal(true);
              }}
            >
              End room
            </Button>
          ) : null,
          <Button
            key={0}
            size="md"
            shape="rectangle"
            variant="danger"
            onClick={() => {
              leave();
              redirectToLeave();
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
        classes={{
          rightRoot: "flex",
        }}
      />
      <MessageModal
        {...errorModal}
        onClose={() => setErrorModal(initialModalProps)}
      />
      <MessageModal
        show={showEndRoomModal}
        onClose={() => {
          setShowEndRoomModal(false);
          setLockRoom(false);
        }}
        title="End Room"
        body="Are you sure you want to end the room?"
        footer={
          <div className="flex">
            <div className="flex items-center">
              <label className="text-base dark:text-white text-gray-100">
                <input
                  type="checkbox"
                  className="mr-1"
                  onChange={() => setLockRoom(prev => !prev)}
                  checked={lockRoom}
                />
                <span>Lock room</span>
              </label>
            </div>
            <Button
              classes={{ root: "mr-3 ml-3" }}
              onClick={() => {
                setShowEndRoomModal(false);
                setLockRoom(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                hmsActions.endRoom(lockRoom, "End Room");
                redirectToLeave();
              }}
            >
              End Room
            </Button>
          </div>
        }
      />
    </>
  ) : null;
};
