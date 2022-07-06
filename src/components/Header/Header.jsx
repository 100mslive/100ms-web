import React, { Fragment, useContext } from "react";
import {
  useHMSStore,
  selectDominantSpeaker,
  selectLocalPeerRoleName,
  selectIsConnectedToRoom,
  selectIsAllowedToPublish,
  useRecordingStreaming,
  useHMSActions,
  selectPermissions,
} from "@100mslive/react-sdk";
import {
  SpeakerIcon,
  GoLiveIcon,
  EndStreamIcon,
  RecordIcon,
} from "@100mslive/react-icons";
import {
  Flex,
  Text,
  textEllipsis,
  Box,
  styled,
  Button,
  Tooltip,
} from "@100mslive/react-ui";
import { ParticipantCount } from "./ParticipantList";
import PIPComponent from "../PIP/PIPComponent";
import { AppContext } from "../context/AppContext";
import { useSidepaneToggle } from "../AppData/useSidepane";
import {
  DEFAULT_HLS_VIEWER_ROLE,
  SIDE_PANE_OPTIONS,
} from "../../common/constants";

export const Header = ({ isPreview }) => {
  const localPeerRole = useHMSStore(selectLocalPeerRoleName);
  const showPip = localPeerRole !== DEFAULT_HLS_VIEWER_ROLE && !isPreview;
  return (
    <Flex
      justify="between"
      align="center"
      css={{ position: "relative", height: "100%" }}
    >
      <Flex align="center" css={{ position: "absolute", left: "$10" }}>
        <Logo />
      </Flex>
      {!isPreview ? <SpeakerTag /> : null}
      <Flex align="center" css={{ position: "absolute", right: "$10" }}>
        {showPip && <PIPComponent />}
        <StreamActions />
        <Box css={{ mx: "$2" }}>
          <ParticipantCount />
        </Box>
      </Flex>
    </Flex>
  );
};

const SpeakerTag = () => {
  const dominantSpeaker = useHMSStore(selectDominantSpeaker);
  return dominantSpeaker && dominantSpeaker.name ? (
    <Flex
      align="center"
      justify="center"
      css={{ flex: "1 1 0", color: "$textPrimary", "@md": { display: "none" } }}
    >
      <SpeakerIcon width={24} height={24} />
      <Text
        variant="md"
        css={{ ...textEllipsis(200), ml: "$2" }}
        title={dominantSpeaker.name}
      >
        {dominantSpeaker.name}
      </Text>
    </Flex>
  ) : (
    <></>
  );
};

const LogoImg = styled("img", {
  maxHeight: "$14",
  p: "$2",
  w: "auto",
  "@md": {
    maxHeight: "$12",
  },
});

const Logo = () => {
  const { logo } = useContext(AppContext);
  return <LogoImg src={logo} alt="Brand Logo" width={132} height={40} />;
};

const EndStream = () => {
  const { isHLSRecordingOn, isHLSRunning } = useRecordingStreaming();
  const hmsActions = useHMSActions();
  if (!isHLSRunning) {
    return null;
  }
  return (
    <Flex align="center">
      <Flex align="center">
        {isHLSRecordingOn && (
          <Tooltip title="HLS Recording on">
            <Text css={{ color: "$error" }}>
              <RecordIcon width={16} height={16} />
            </Text>
          </Tooltip>
        )}
        <Text css={{ ml: "$2" }}>Live with HLS</Text>
      </Flex>
      <Button
        variant="standard"
        icon
        css={{ mx: "$8" }}
        onClick={async () => {
          await hmsActions.stopHLSStreaming();
        }}
      >
        <EndStreamIcon />
        End Stream
      </Button>
    </Flex>
  );
};

const GoLive = () => {
  const toggleStreaming = useSidepaneToggle(SIDE_PANE_OPTIONS.STREAMING);
  const { isHLSRunning } = useRecordingStreaming();
  if (isHLSRunning) {
    return null;
  }
  return (
    <Button variant="standard" onClick={toggleStreaming} css={{ mx: "$2" }}>
      <GoLiveIcon />
      <Text css={{ mx: "$2" }}>Go Live</Text>
    </Button>
  );
};

const StreamActions = () => {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const permissions = useHMSStore(selectPermissions);
  const isPublishingAnything = Object.values(isAllowedToPublish).some(
    value => !!value
  );
  if (!isConnected || !isPublishingAnything || !permissions.streaming) {
    return null;
  }
  return (
    <Fragment>
      <GoLive />
      <EndStream />
    </Fragment>
  );
};
