import { Fragment, useState } from "react";
import {
  BrbIcon,
  ChatIcon,
  ChatUnreadIcon,
  HandIcon,
  MusicIcon,
} from "@100mslive/react-icons";
import {
  HMSPlaylistType,
  selectIsAllowedToPublish,
  selectUnreadHMSMessagesCount,
  useHMSStore,
  useScreenShare,
} from "@100mslive/react-sdk";
import {
  Flex,
  IconButton,
  Tooltip,
  VerticalDivider,
} from "@100mslive/react-ui";
import { AudioVideoToggle } from "./AudioVideoToggle";
import { LeaveRoom } from "./LeaveRoom";
import { MoreSettings } from "./MoreSettings/MoreSettings";
import { Playlist } from "./Playlist/Playlist";
import { Screenshare } from "./ScreenShare";
import { ScreenShareHintModal } from "./ScreenshareHintModal";
import { NoiseSuppression } from "../plugins/NoiseSuppression";
import { ToggleWhiteboard } from "../plugins/whiteboard";
import { VirtualBackground } from "../plugins/VirtualBackground";
import { TranscriptionButton } from "../plugins/transcription";
import { useMyMetadata } from "./hooks/useMetadata";
import { FeatureFlags } from "../services/FeatureFlags";
import { isScreenshareSupported } from "../common/utils";

const ScreenshareAudio = () => {
  const {
    amIScreenSharing,
    screenShareVideoTrackId: video,
    screenShareAudioTrackId: audio,
    toggleScreenShare,
  } = useScreenShare();
  const isAudioScreenshare = amIScreenSharing && !video && !!audio;
  const [showModal, setShowModal] = useState(false);
  if (!isScreenshareSupported()) {
    return null;
  }
  return (
    <Fragment>
      <Tooltip
        title={`${!isAudioScreenshare ? "Start" : "Stop"} audio sharing`}
        key="shareAudio"
      >
        <IconButton
          active={!isAudioScreenshare}
          css={{ mr: "$4" }}
          onClick={() => {
            if (amIScreenSharing) {
              toggleScreenShare(true);
            } else {
              setShowModal(true);
            }
          }}
        >
          <MusicIcon />
        </IconButton>
      </Tooltip>
      {showModal && (
        <ScreenShareHintModal onClose={() => setShowModal(false)} />
      )}
    </Fragment>
  );
};

export const MetaActions = () => {
  const { isHandRaised, isBRBOn, toggleHandRaise, toggleBRB } = useMyMetadata();

  return (
    <Flex align="center">
      <Tooltip
        title={`${!isHandRaised ? "Raise" : "Unraise"} hand`}
        css={{ mx: "$4" }}
      >
        <IconButton onClick={toggleHandRaise} active={!isHandRaised}>
          <HandIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={`${isBRBOn ? `I'm back` : `I'll be right back`}`}>
        <IconButton css={{ mx: "$4" }} onClick={toggleBRB} active={!isBRBOn}>
          <BrbIcon />
        </IconButton>
      </Tooltip>
    </Flex>
  );
};

const Chat = ({ isChatOpen, toggleChat }) => {
  const countUnreadMessages = useHMSStore(selectUnreadHMSMessagesCount);

  return (
    <Tooltip key="chat" title={`${isChatOpen ? "Close" : "Open"} chat`}>
      <IconButton css={{ mx: "$4" }} onClick={toggleChat} active={!isChatOpen}>
        {countUnreadMessages === 0 ? <ChatIcon /> : <ChatUnreadIcon />}
      </IconButton>
    </Tooltip>
  );
};

export const Footer = ({ isChatOpen, toggleChat }) => {
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  return (
    <Flex
      justify="between"
      align="center"
      css={{
        position: "relative",
        height: "100%",
        "@md": { flexWrap: "wrap" },
      }}
    >
      <Flex
        align="center"
        css={{
          position: "absolute",
          left: "$7",
          "@md": {
            position: "unset",
            justifyContent: "center",
            w: "100%",
            p: "$4 0",
          },
        }}
      >
        {isAllowedToPublish.screen && (
          <Fragment>
            <ScreenshareAudio />
            <Playlist type={HMSPlaylistType.audio} />
            <Playlist type={HMSPlaylistType.video} />
            <VerticalDivider space={4} />
          </Fragment>
        )}
        <MetaActions />
        {FeatureFlags.enableWhiteboard && <ToggleWhiteboard />}
      </Flex>
      <Flex align="center" justify="center" css={{ w: "100%" }}>
        <AudioVideoToggle />
        <Screenshare css={{ mx: "$4" }} />
        <VirtualBackground />
        {FeatureFlags.enableTranscription && <TranscriptionButton />}
        <NoiseSuppression />
        {(isAllowedToPublish.audio || isAllowedToPublish.video) && (
          <VerticalDivider space={4} />
        )}
        <MoreSettings />
        <Flex
          align="center"
          css={{ display: "none", "@md": { display: "flex", ml: "$4" } }}
        >
          <Chat isChatOpen={isChatOpen} toggleChat={toggleChat} />
          <LeaveRoom />
        </Flex>
      </Flex>
      <Flex
        align="center"
        css={{
          position: "absolute",
          right: "$7",
          "@md": {
            display: "none",
          },
        }}
      >
        <Chat isChatOpen={isChatOpen} toggleChat={toggleChat} />
        <LeaveRoom />
      </Flex>
    </Flex>
  );
};
