import { useState, useCallback } from "react";
import {
  useHMSStore,
  ControlBar,
  AudioPlaylist,
  Button,
  ChatIcon,
  ChatUnreadIcon,
  VideoPlaylistIcon,
  VerticalDivider,
  MessageModal,
  useHMSActions,
  selectIsLocalScreenShared,
  selectUnreadHMSMessagesCount,
  selectIsAllowedToPublish,
  selectLocalPeerID,
  selectScreenSharesByPeerId,
  selectVideoPlaylist,
  VideoPlaylist,
  selectIsConnectedToRoom,
} from "@100mslive/hms-video-react";
import { MoreSettings } from "./components/MoreSettings";
import { AudioVideoToggle } from "./components/AudioVideoToggle";
import { LeaveRoom } from "./components/LeaveRoom";
import { useMyMetadata } from "./hooks/useMetadata";
import { Box, IconButton, Tooltip } from "@100mslive/react-ui";
import {
  HandIcon,
  ShareScreenIcon,
  MusicIcon,
  BrbIcon,
} from "@100mslive/react-icons";
import { VirtualBackground } from "./components/VirtualBackground";
import { isScreenshareSupported } from "../common/utils";
import { NoiseSuppression } from "./components/NoiseSuppression";
import { TranscriptionButton } from "./components/Transcription";

export const ConferenceFooter = ({ isChatOpen, toggleChat }) => {
  const isScreenShared = useHMSStore(selectIsLocalScreenShared);
  const localPeer = useHMSStore(selectLocalPeerID);
  const { video, audio } = useHMSStore(selectScreenSharesByPeerId(localPeer));
  const countUnreadMessages = useHMSStore(selectUnreadHMSMessagesCount);
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const activeVideoPlaylist = useHMSStore(selectVideoPlaylist.selection).id;
  const [shareAudioModal, setShareAudioModal] = useState(false);
  const { isHandRaised, isBRBOn, toggleHandRaise, toggleBRB } = useMyMetadata();

  const initialModalProps = {
    show: false,
    title: "",
    body: "",
  };
  const [errorModal, setErrorModal] = useState(initialModalProps);

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

  if (isAllowedToPublish.screen && isScreenshareSupported()) {
    leftComponents.push(
      <Tooltip
        title={`${!isAudioScreenshare ? "Start" : "Stop"} audio sharing`}
        key="shareAudio"
      >
        <IconButton
          active={!isAudioScreenshare}
          onClick={() => {
            if (isAudioScreenshare) {
              toggleScreenShare(false, true);
            } else {
              setShareAudioModal(true);
            }
          }}
          css={{ "@md": { display: "none" } }}
        >
          <MusicIcon />
        </IconButton>
      </Tooltip>,
      <Box key="audioShareDivider" css={{ "@md": { display: "none" } }}>
        <VerticalDivider />
      </Box>
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
    leftComponents.push(
      <Box css={{ "@md": { display: "none" } }} key="audioPlaylist">
        <AudioPlaylist />
      </Box>
    );
  isAllowedToPublish.screen &&
    leftComponents.push(
      <Box css={{ "@md": { display: "none" } }} key="videoPlaylistIcon">
        <VideoPlaylist
          key="videoPlaylist"
          trigger={<VideoPlaylistIcon />}
          active={activeVideoPlaylist}
        />
      </Box>
    );
  leftComponents.push(
    <Tooltip
      title={`${!isHandRaised ? "Raise" : "Unraise"} hand`}
      key="raise-hand"
    >
      <IconButton onClick={toggleHandRaise} active={!isHandRaised}>
        <HandIcon />
      </IconButton>
    </Tooltip>
  );
  leftComponents.push(
    <Tooltip title={` Turn ${!isBRBOn ? "on" : "off"} BRB`} key="brb">
      <IconButton
        css={{ mx: "$2", "@md": { display: "none" } }}
        onClick={toggleBRB}
        active={!isBRBOn}
      >
        <BrbIcon />
      </IconButton>
    </Tooltip>
  );

  const isPublishing = isAllowedToPublish.video || isAllowedToPublish.audio;
  if (!isConnected) {
    return null;
  }
  return (
    <>
      <div id="speechtxt" className="transcribe"></div>
      <ControlBar
        leftComponents={leftComponents}
        centerComponents={[
          <AudioVideoToggle key="audioVideoToggle" />,
          isAllowedToPublish.screen && isScreenshareSupported() ? (
            <Tooltip
              title={`${!isScreenShared ? "Start" : "Stop"} screen sharing`}
              key="toggleScreenShare"
            >
              <IconButton
                active={!isScreenShared}
                onClick={() => toggleScreenShare(!isScreenShared)}
                css={{ mx: "$2", "@md": { display: "none" } }}
              >
                <ShareScreenIcon />
              </IconButton>
            </Tooltip>
          ) : null,
          isAllowedToPublish.video ? <VirtualBackground key="vb" /> : null,
          isAllowedToPublish.audio ? (
            <TranscriptionButton key="voiceTranscription" />
          ) : null,
          isAllowedToPublish.audio ? (
            <NoiseSuppression key="noiseSupression" />
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
