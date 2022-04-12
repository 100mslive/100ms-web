import React, { Fragment, useState } from "react";
import {
  BrbIcon,
  ChatIcon,
  ChatUnreadIcon,
  HandIcon,
  MusicIcon,
} from "@100mslive/react-icons";
import {
  HMSPlaylistType,
  selectUnreadHMSMessagesCount,
  selectIsAllowedToPublish,
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
import { Screenshare } from "./ScreenShare";
import { ScreenShareHintModal } from "./ScreenshareHintModal";
import { NoiseSuppression } from "../plugins/NoiseSuppression";
import { ToggleWhiteboard } from "../plugins/whiteboard";
import { VirtualBackground } from "../plugins/VirtualBackground/VirtualBackground";
import { useMyMetadata } from "./hooks/useMetadata";
import { FeatureFlags } from "../services/FeatureFlags";
import { isScreenshareSupported } from "../common/utils";
import { Playlist } from "../components/Playlist/Playlist";

const TranscriptionButton = React.lazy(() =>
  import("../plugins/transcription")
);

const ScreenshareAudio = () => {
  const {
    amIScreenSharing,
    screenShareVideoTrackId: video,
    screenShareAudioTrackId: audio,
    toggleScreenShare,
  } = useScreenShare();
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const isAudioScreenshare = amIScreenSharing && !video && !!audio;
  const [showModal, setShowModal] = useState(false);
  if (!isAllowedToPublish.screen || !isScreenshareSupported()) {
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
          data-testid="screenshare_audio"
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

export const MetaActions = ({ isMobile = false }) => {
  const { isHandRaised, isBRBOn, toggleHandRaise, toggleBRB } = useMyMetadata();

  return (
    <Flex align="center">
      <Tooltip
        title={`${!isHandRaised ? "Raise" : "Unraise"} hand`}
        css={{ mx: "$4" }}
      >
        <IconButton
          onClick={toggleHandRaise}
          active={!isHandRaised}
          data-testid={`${
            isMobile ? "raise_hand_btn_mobile" : "raise_hand_btn"
          }`}
        >
          <HandIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={`${isBRBOn ? `I'm back` : `I'll be right back`}`}>
        <IconButton
          css={{ mx: "$4" }}
          onClick={toggleBRB}
          active={!isBRBOn}
          data-testid="brb_btn"
        >
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
      <IconButton
        css={{ mx: "$4" }}
        onClick={toggleChat}
        active={!isChatOpen}
        data-testid="chat_btn"
      >
        {countUnreadMessages === 0 ? (
          <ChatIcon />
        ) : (
          <ChatUnreadIcon data-testid="chat_unread_btn" />
        )}
      </IconButton>
    </Tooltip>
  );
};

export const Footer = ({ isChatOpen, toggleChat, isAudioOnly }) => {
  return (
    <Flex
      justify="between"
      align="center"
      css={{
        padding: "$2",
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
        <ScreenshareAudio />
        <Playlist type={HMSPlaylistType.audio} />
        <Playlist type={HMSPlaylistType.video} />
        {FeatureFlags.enableWhiteboard ? <ToggleWhiteboard /> : null}
        <LeftDivider />
        <VirtualBackground />
        <NoiseSuppression />
        {FeatureFlags.enableTranscription && <TranscriptionButton />}
        <Flex
          align="center"
          css={{
            display: "none",
            "@md": {
              display: "flex",
            },
          }}
        >
          <VerticalDivider space={4} />
          <MetaActions isMobile />
        </Flex>
      </Flex>
      <Flex align="center" justify="center" css={{ w: "100%" }}>
        <AudioVideoToggle isAudioOnly={isAudioOnly} />
        <Screenshare isAudioOnly={isAudioOnly} css={{ mx: "$4" }} />
        <MoreSettings />
        <VerticalDivider space={4} />
        <LeaveRoom />
        <Flex
          align="center"
          css={{ display: "none", "@md": { display: "flex", ml: "$4" } }}
        >
          <Chat isChatOpen={isChatOpen} toggleChat={toggleChat} />
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
        <MetaActions />
        <VerticalDivider space={4} />
        <Chat isChatOpen={isChatOpen} toggleChat={toggleChat} />
      </Flex>
    </Flex>
  );
};

const LeftDivider = () => {
  const allowedToPublish = useHMSStore(selectIsAllowedToPublish);
  return (
    <>
      {allowedToPublish.screen || FeatureFlags.enableWhiteboard ? (
        <VerticalDivider space={4} />
      ) : null}
    </>
  );
};
