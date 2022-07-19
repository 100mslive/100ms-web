import { Fragment } from "react";
import {
  selectIsAllowedToPublish,
  selectIsConnectedToRoom,
  selectPermissions,
  useHMSStore,
  useRecordingStreaming,
} from "@100mslive/react-sdk";
import { EndStreamIcon, RecordIcon } from "@100mslive/react-icons";
import { Box, Button, Flex, Text, Tooltip } from "@100mslive/react-ui";
import GoLiveButton from "../GoLiveButton";
import { useSidepaneToggle } from "../AppData/useSidepane";
import { SIDE_PANE_OPTIONS } from "../../common/constants";
import { getRecordingText } from "./AdditionalRoomState";

export const LiveStatus = () => {
  const { isHLSRunning, isRTMPRunning } = useRecordingStreaming();
  if (!isHLSRunning && !isRTMPRunning) {
    return null;
  }
  return (
    <Flex align="center" css={{ ml: "$4" }}>
      <Box css={{ w: "$4", h: "$4", r: "$round", bg: "$error", mr: "$4" }} />
      <Text>
        Live
        <Text as="span" css={{ "@md": { display: "none" } }}>
          &nbsp;with {isHLSRunning ? "HLS" : "RTMP"}
        </Text>
      </Text>
    </Flex>
  );
};

export const RecordingStatus = () => {
  const {
    isBrowserRecordingOn,
    isServerRecordingOn,
    isHLSRecordingOn,
    isRecordingOn,
  } = useRecordingStreaming();

  if (!isRecordingOn) {
    return null;
  }
  return (
    <Tooltip
      title={getRecordingText({
        isBrowserRecordingOn,
        isServerRecordingOn,
        isHLSRecordingOn,
      })}
    >
      <Button
        variant="standard"
        outlined
        css={{ color: "$error", ml: "$8", px: "$4" }}
      >
        <RecordIcon width={24} height={24} style={{ marginRight: "0.25rem" }} />
      </Button>
    </Tooltip>
  );
};

const EndStream = () => {
  const { isStreamingOn } = useRecordingStreaming();
  const toggleStreaming = useSidepaneToggle(SIDE_PANE_OPTIONS.STREAMING);
  if (!isStreamingOn) {
    return null;
  }
  return (
    <Flex align="center">
      <Flex align="center" css={{ "@md": { display: "none" } }}>
        <LiveStatus />
        <RecordingStatus />
      </Flex>
      <Button
        variant="standard"
        outlined
        icon
        css={{ mx: "$8" }}
        onClick={() => {
          toggleStreaming();
        }}
      >
        <EndStreamIcon />
        End Stream
      </Button>
    </Flex>
  );
};

export const StreamActions = () => {
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
      <GoLiveButton />
      <EndStream />
    </Fragment>
  );
};
