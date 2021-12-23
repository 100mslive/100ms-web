import { useState, useCallback, useRef } from "react";
import {
  useHMSStore,
  ControlBar,
  AudioPlaylist,
  Button,
  ChatIcon,
  ChatUnreadIcon,
  MusicIcon,
  VideoPlaylistIcon,
  VerticalDivider,
  MessageModal,
  useHMSActions,
  selectIsLocalScreenShared,
  selectUnreadHMSMessagesCount,
  isMobileDevice,
  selectIsAllowedToPublish,
  selectIsLocalVideoPluginPresent,
  selectIsLocalAudioPluginPresent,
  selectLocalPeerID,
  selectScreenSharesByPeerId,
  selectVideoPlaylist,
  VideoPlaylist,
  selectIsConnectedToRoom,
} from "@100mslive/hms-video-react";
import { HMSVirtualBackgroundPlugin } from "@100mslive/hms-virtual-background";
import { HMSNoiseSuppressionPlugin } from "@100mslive/hms-noise-suppression";
import { getRandomVirtualBackground } from "../common/utils";
import { MoreSettings } from "./components/MoreSettings";
import { AudioVideoToggle } from "./components/AudioVideoToggle";
import { LeaveRoom } from "./components/LeaveRoom";
import { useMetadata } from "./hooks/useMetadata";
import { IconButton, Tooltip } from "@100mslive/react-ui";
import {
  HandIcon,
  AudioLevelIcon,
  VirtualBackgroundIcon,
  ShareScreenIcon,
} from "@100mslive/react-icons";

export const ConferenceFooter = ({ isChatOpen, toggleChat }) => {
  const isScreenShared = useHMSStore(selectIsLocalScreenShared);
  const localPeer = useHMSStore(selectLocalPeerID);
  const { video, audio } = useHMSStore(selectScreenSharesByPeerId(localPeer));
  const countUnreadMessages = useHMSStore(selectUnreadHMSMessagesCount);
  const isVBPresent = useHMSStore(
    selectIsLocalVideoPluginPresent("@100mslive/hms-virtual-background")
  );
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);

  const pluginRef = useRef(null);
  const audiopluginRef = useRef(null);
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const activeVideoPlaylist = useHMSStore(selectVideoPlaylist.selection).id;
  const [shareAudioModal, setShareAudioModal] = useState(false);
  const { isHandRaised, setIsHandRaised } = useMetadata();
  const isNoiseSuppression = useHMSStore(
    selectIsLocalAudioPluginPresent("@100mslive/hms-noise-suppression")
  );
  const initialModalProps = {
    show: false,
    title: "",
    body: "",
  };
  const [errorModal, setErrorModal] = useState(initialModalProps);

  function createNoiseSuppresionPlugin() {
    if (!audiopluginRef.current) {
      audiopluginRef.current = new HMSNoiseSuppressionPlugin();
    }
  }

  async function addNoiseSuppressionPlugin() {
    createNoiseSuppresionPlugin();
    try {
      await hmsActions.addPluginToAudioTrack(audiopluginRef.current);
    } catch (err) {
      console.error("add noise suppression plugin failed", err);
    }
  }

  async function removeNoiseSuppressionPlugin() {
    if (audiopluginRef.current) {
      await hmsActions.removePluginFromAudioTrack(audiopluginRef.current);
      audiopluginRef.current = null;
    }
  }

  function createVBPlugin() {
    if (!pluginRef.current) {
      pluginRef.current = new HMSVirtualBackgroundPlugin("none", true);
    }
  }

  async function startPlugin() {
    //create plugin if not present
    createVBPlugin();
    window.HMS.virtualBackground = pluginRef.current;
    try {
      await pluginRef.current.setBackground(getRandomVirtualBackground());
      //Running VB on every alternate frame rate for optimized cpu usage
      await hmsActions.addPluginToVideoTrack(pluginRef.current, 15);
    } catch (err) {
      console.error("add virtual background plugin failed", err);
    }
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

  function handleNoiseSuppression() {
    isNoiseSuppression
      ? removeNoiseSuppressionPlugin()
      : addNoiseSuppressionPlugin();
  }

  const toggleScreenShare = useCallback(
    async (enable, audioOnly = false) => {
      try {
        await hmsActions.setScreenShareEnabled(enable, audioOnly);
      } catch (error) {
        if (
          error.description &&
          error.description.includes("denied by system")
        ) {
          setErrorModal({
            show: true,
            title: "Screen share permission denied by OS",
            body: "Please update your OS settings to permit screen share.",
          });
        } else if (error.message && error.message.includes("share audio")) {
          // when share audio not selected with audioOnly screenshare
          setErrorModal({
            show: true,
            title: "Screenshare error",
            body: error.message,
          });
        } else if (
          error.message &&
          error.message === "Cannot share multiple screens"
        ) {
          // when share audio not selected with audioOnly screenshare
          setErrorModal({
            show: true,
            title: "Screenshare error",
            body: error.message,
          });
        }
      }
    },
    [hmsActions]
  );

  const leftComponents = [];
  const isAudioScreenshare = !video && !!audio;

  if (!isMobileDevice()) {
    //creating VB button for only web
    createVBPlugin();
    createNoiseSuppresionPlugin();
    if (isAllowedToPublish.screen) {
      leftComponents.push(
        <Button
          key="shareAudio"
          iconOnly
          variant="no-fill"
          iconSize="md"
          shape="rectangle"
          active={isAudioScreenshare}
          onClick={() => {
            if (isAudioScreenshare) {
              toggleScreenShare(false, true);
            } else {
              setShareAudioModal(true);
            }
          }}
        >
          <MusicIcon />
        </Button>,
        <VerticalDivider key="audioShareDivider" />
      );
    }
    leftComponents.push(
      <Button
        key="chat"
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
    isAllowedToPublish.screen &&
      leftComponents.push(<AudioPlaylist key="audioPlaylist" />);
    isAllowedToPublish.screen &&
      leftComponents.push(
        <VideoPlaylist
          key="videoPlaylist"
          trigger={<VideoPlaylistIcon key="videoPlaylistIcon" />}
          active={activeVideoPlaylist}
        />
      );
    leftComponents.push(
      <Tooltip title={`${!isHandRaised ? "Raise" : "Unraise"} hand`}>
        <IconButton
          key="raise-hand"
          onClick={() => setIsHandRaised(!isHandRaised)}
          active={!isHandRaised}
        >
          <HandIcon />
        </IconButton>
      </Tooltip>
    );
  }
  if (isMobileDevice()) {
    leftComponents.push(
      <Button
        key="chat"
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
    leftComponents.push(
      <IconButton
        key="raise-hand"
        onClick={() => setIsHandRaised(!isHandRaised)}
        active={!isHandRaised}
      >
        <HandIcon />
      </IconButton>
    );
  }

  const isPublishing = isAllowedToPublish.video || isAllowedToPublish.audio;
  if (!isConnected) {
    return null;
  }

  return (
    <>
      <ControlBar
        leftComponents={leftComponents}
        centerComponents={[
          <AudioVideoToggle key="audioVideoToggle" />,
          isAllowedToPublish.screen && !isMobileDevice() ? (
            <Tooltip
              title={`${!isScreenShared ? "Start" : "Stop"} screen sharing`}
            >
              <IconButton
                active={!isScreenShared}
                key="toggleScreenShare"
                className="mx-2"
                onClick={() => toggleScreenShare(!isScreenShared)}
              >
                <ShareScreenIcon />
              </IconButton>
            </Tooltip>
          ) : null,
          isAllowedToPublish.video && pluginRef.current?.isSupported() ? (
            <Tooltip
              title={`Turn ${!isVBPresent ? "on" : "off"} virtual background`}
            >
              <IconButton
                active={!isVBPresent}
                onClick={handleVirtualBackground}
                className="mx-2"
                key="VB"
              >
                <VirtualBackgroundIcon />
              </IconButton>
            </Tooltip>
          ) : null,
          isAllowedToPublish.audio && audiopluginRef.current?.isSupported() ? (
            <Tooltip
              title={`Turn ${
                !isNoiseSuppression ? "on" : "off"
              } noise suppression`}
            >
              <IconButton
                className="ml-2"
                active={!isNoiseSuppression}
                onClick={handleNoiseSuppression}
                key="noiseSuppression"
              >
                <AudioLevelIcon />
              </IconButton>
            </Tooltip>
          ) : null,
          isPublishing && (
            <span key="SettingsLeftSpace" className="mx-2 md:mx-3"></span>
          ),
          isPublishing && <VerticalDivider key="SettingsDivider" />,
          isPublishing && (
            <span key="SettingsRightSpace" className="mx-2 md:mx-3"></span>
          ),
          <MoreSettings key="MoreSettings" />,
        ]}
        rightComponents={[<LeaveRoom key="leaveRoom" />]}
        backgroundButtonOnClick={handleVirtualBackground}
        isBackgroundEnabled={isVBPresent}
      />
      <MessageModal
        {...errorModal}
        onClose={() => setErrorModal(initialModalProps)}
      />
      <MessageModal
        show={shareAudioModal}
        onClose={() => {
          setShareAudioModal(false);
        }}
        title="How to play music"
        body={
          <>
            <img
              src="/share-audio.png"
              className="mt-4"
              alt="select ‘Chrome Tab’ option in the share screen
          window, then click the ‘Share audio’ button"
            ></img>
          </>
        }
        footer={
          <Button
            variant="emphasized"
            onClick={() => {
              setShareAudioModal(false);
              toggleScreenShare(!isAudioScreenshare, true);
            }}
          >
            Continue
          </Button>
        }
        classes={{
          footer: "justify-center",
          header: "mb-2",
          boxTransition: "sm:max-w-4xl",
        }}
      />
    </>
  );
};
