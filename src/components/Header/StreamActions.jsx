import { Fragment, useState } from "react";
import { useMedia } from "react-use";
import {
  selectAppData,
  selectIsConnectedToRoom,
  selectPermissions,
  useHMSActions,
  useHMSStore,
  useRecordingStreaming,
} from "@100mslive/react-sdk";
import { EndStreamIcon, RecordIcon } from "@100mslive/react-icons";
import {
  Box,
  Button,
  config as cssConfig,
  Flex,
  Loading,
  Popover,
  Text,
  Tooltip,
} from "@100mslive/react-ui";
import GoLiveButton from "../GoLiveButton";
import { ResolutionInput } from "../Streaming/ResolutionInput";
import { getResolution } from "../Streaming/RTMPStreaming";
import { ToastManager } from "../Toast/ToastManager";
import { AdditionalRoomState, getRecordingText } from "./AdditionalRoomState";
import { useSidepaneToggle } from "../AppData/useSidepane";
import { useSetAppDataByKey } from "../AppData/useUISettings";
import { getDefaultMeetingUrl } from "../../common/utils";
import {
  APP_DATA,
  RTMP_RECORD_DEFAULT_RESOLUTION,
  SIDE_PANE_OPTIONS,
} from "../../common/constants";

export const LiveStatus = () => {
  const { isHLSRunning, isRTMPRunning } = useRecordingStreaming();
  if (!isHLSRunning && !isRTMPRunning) {
    return null;
  }
  return (
    <Flex align="center">
      <Box css={{ w: "$4", h: "$4", r: "$round", bg: "$error", mr: "$2" }} />
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
  const permissions = useHMSStore(selectPermissions);

  if (
    !isRecordingOn ||
    // if only browser recording is enabled, stop recording is shown
    // so no need to show this as it duplicates
    [
      permissions?.browserRecording,
      !isServerRecordingOn,
      !isHLSRecordingOn,
      isBrowserRecordingOn,
    ].every(value => !!value)
  ) {
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
      <Box
        css={{
          color: "$error",
        }}
      >
        <RecordIcon width={24} height={24} />
      </Box>
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
    <Button
      data-testid="end_stream"
      variant="standard"
      outlined
      icon
      onClick={() => {
        toggleStreaming();
      }}
    >
      <EndStreamIcon />
      End Stream
    </Button>
  );
};

const StartRecording = () => {
  const permissions = useHMSStore(selectPermissions);
  const recordingUrl = useHMSStore(selectAppData(APP_DATA.recordingUrl));
  const [resolution, setResolution] = useState(RTMP_RECORD_DEFAULT_RESOLUTION);
  const [open, setOpen] = useState(false);
  const [recordingStarted, setRecordingState] = useSetAppDataByKey(
    APP_DATA.recordingStarted
  );
  const { isBrowserRecordingOn, isStreamingOn, isHLSRunning } =
    useRecordingStreaming();
  const hmsActions = useHMSActions();
  if (!permissions?.browserRecording || isHLSRunning) {
    return null;
  }
  if (isBrowserRecordingOn) {
    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button
            variant="danger"
            data-testid="stop_recording"
            icon
            outlined
            onClick={() => setOpen(true)}
          >
            <RecordIcon />
            <Text
              as="span"
              css={{ "@md": { display: "none" }, color: "currentColor" }}
            >
              Stop Recording
            </Text>
          </Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content align="end" sideOffset={8} css={{ w: "$64" }}>
            <Text variant="body" css={{ color: "$textMedEmp" }}>
              Are you sure you want to end the recording?
            </Text>
            <Button
              data-testid="stop_recording_confirm"
              variant="danger"
              icon
              css={{ ml: "auto" }}
              onClick={async () => {
                try {
                  await hmsActions.stopRTMPAndRecording();
                } catch (error) {
                  ToastManager.addToast({
                    title: error.message,
                    variant: "error",
                  });
                }
                setOpen(false);
              }}
            >
              Stop
            </Button>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  }
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          data-testid="start_recording"
          variant="standard"
          icon
          disabled={recordingStarted || isStreamingOn}
          onClick={() => setOpen(true)}
        >
          {recordingStarted ? (
            <Loading size={24} color="currentColor" />
          ) : (
            <RecordIcon />
          )}
          <Text
            as="span"
            css={{ "@md": { display: "none" }, color: "currentColor" }}
          >
            {recordingStarted ? "Starting" : "Start"} Recording
          </Text>
        </Button>
      </Popover.Trigger>
      <Popover.Content align="end" sideOffset={8} css={{ w: "$64" }}>
        <ResolutionInput
          testId="recording_resolution"
          css={{ flexDirection: "column", alignItems: "start" }}
          onResolutionChange={setResolution}
        />
        <Button
          data-testid="start_recording_confirm"
          variant="primary"
          icon
          css={{ ml: "auto" }}
          type="submit"
          disabled={recordingStarted || isStreamingOn}
          onClick={async () => {
            try {
              setRecordingState(true);
              await hmsActions.startRTMPOrRecording({
                meetingURL: recordingUrl || getDefaultMeetingUrl(),
                resolution: getResolution(resolution),
                record: true,
              });
            } catch (error) {
              if (error.message.includes("stream already running")) {
                ToastManager.addToast({
                  title: "Recording already running",
                  variant: "error",
                });
              } else {
                ToastManager.addToast({
                  title: error.message,
                  variant: "error",
                });
              }
              setRecordingState(false);
            }
            setOpen(false);
          }}
        >
          Start
        </Button>
      </Popover.Content>
    </Popover.Root>
  );
};

export const StreamActions = () => {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const permissions = useHMSStore(selectPermissions);
  const isMobile = useMedia(cssConfig.media.md);
  return (
    <Flex align="center" css={{ gap: "$4" }}>
      <AdditionalRoomState />
      <Flex align="center" css={{ gap: "$4", "@md": { display: "none" } }}>
        <LiveStatus />
        <RecordingStatus />
      </Flex>
      {isConnected && !isMobile ? <StartRecording /> : null}
      {isConnected && (permissions.hlsStreaming || permissions.rtmpStreaming) && (
        <Fragment>
          <GoLiveButton />
          <EndStream />
        </Fragment>
      )}
    </Flex>
  );
};
