import { BrbIcon, HandIcon, MusicIcon } from "@100mslive/react-icons";
import {
  selectIsAllowedToPublish,
  useHMSStore,
  useScreenShare,
} from "@100mslive/react-sdk";
import {
  Box,
  Flex,
  IconButton,
  Tooltip,
  VerticalDivider,
} from "@100mslive/react-ui";
import { Fragment, useState } from "react";
import { isScreenshareSupported } from "../../common/utils";
import { AudioVideoToggle } from "../components/AudioVideoToggle";
import { LeaveRoom } from "../components/LeaveRoom";
import { MoreSettings } from "../components/MoreSettings";
import { NoiseSuppression } from "../components/NoiseSuppression";
import { VirtualBackground } from "../components/VirtualBackground";
import { useMyMetadata } from "../hooks/useMetadata";
import { AudioPlaylist } from "./Playlist/AudioPlaylist";
import { Screenshare } from "./ScreenShare";
import { ScreenShareHintModal } from "./ScreenshareHintModal";

const ScreenshareAudio = () => {
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const {
    amIScreenSharing,
    screenShareVideoTrackId: video,
    screenShareAudioTrackId: audio,
    toggleScreenShare,
  } = useScreenShare();
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
        >
          <MusicIcon />
        </IconButton>
      </Tooltip>
      <VerticalDivider space={4} />
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

export const Footer = () => {
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
            ml: "$4",
            justifyContent: "center",
            w: "100%",
          },
        }}
      >
        <ScreenshareAudio />
        <AudioPlaylist />
        <MetaActions />
      </Flex>
      <Flex align="center" justify="center" css={{ w: "100%" }}>
        <AudioVideoToggle />
        <Screenshare css={{ mx: "$4" }} />
        <VirtualBackground />
        <NoiseSuppression />
        <VerticalDivider space={4} />
        <MoreSettings key="MoreSettings" />
        <Box css={{ display: "none", "@md": { display: "block", ml: "$4" } }}>
          <LeaveRoom />
        </Box>
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
        <LeaveRoom />
      </Flex>
    </Flex>
  );
};
