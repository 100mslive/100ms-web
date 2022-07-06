import { Fragment, useCallback, useState } from "react";
import {
  selectAppData,
  selectPermissions,
  useHMSActions,
  useHMSStore,
  useRecordingStreaming,
} from "@100mslive/react-sdk";
import {
  ChevronRightIcon,
  CrossIcon,
  WiredMic,
  ColoredHandIcon,
  GoLiveIcon,
  ChevronLeftIcon,
  RecordIcon,
  InfoIcon,
  EndStreamIcon,
} from "@100mslive/react-icons";
import {
  Flex,
  Box,
  Text,
  IconButton,
  slideLeftAndFade,
  Button,
  Switch,
} from "@100mslive/react-ui";
import { useSidepaneToggle } from "./AppData/useSidepane";
import { getDefaultMeetingUrl } from "../common/utils";
import { APP_DATA, SIDE_PANE_OPTIONS } from "../common/constants";

export const StreamingLanding = () => {
  const toggleStreaming = useSidepaneToggle(SIDE_PANE_OPTIONS.STREAMING);
  const [showHLS, setShowHLS] = useState(false);

  return (
    <Fragment>
      <Flex css={{ w: "100%", py: "$8" }}>
        <Box
          css={{
            alignSelf: "center",
            p: "$4",
            bg: "$surfaceLight",
            r: "$round",
          }}
        >
          <ColoredHandIcon width={40} height={40} />
        </Box>
        <Box css={{ flex: "1 1 0", mx: "$8" }}>
          <Text variant="sm">Welcome !</Text>
          <Text variant="h6">Let’s get you started</Text>
        </Box>
        <IconButton onClick={toggleStreaming} css={{ alignSelf: "flex-start" }}>
          <CrossIcon />
        </IconButton>
      </Flex>
      <Text variant="tiny" color="$textMedEmp">
        Start Streaming
      </Text>
      <StreamCard
        title="Live Stream with HLS"
        subtitle="Stream to millions, edit and control what the viewer sees and more!"
        css={{ my: "$8" }}
        onClick={() => setShowHLS(true)}
      />
      {showHLS && <HLSStreaming onBack={() => setShowHLS(false)} />}
    </Fragment>
  );
};

const StreamCard = ({ title, subtitle, css = {}, onClick }) => {
  return (
    <Flex
      css={{
        w: "100%",
        p: "$10",
        r: "$1",
        cursor: "pointer",
        bg: "$surfaceLight",
        mb: "$10",
        mt: "$8",
        ...css,
      }}
      onClick={onClick}
    >
      <Text css={{ alignSelf: "center", p: "$4" }}>
        <WiredMic width={40} height={40} />
      </Text>
      <Box css={{ flex: "1 1 0", mx: "$8" }}>
        <Text variant="h6" css={{ mb: "$4" }}>
          {title}
        </Text>
        <Text variant="sm">{subtitle}</Text>
      </Box>
      <Text css={{ alignSelf: "center" }}>
        <ChevronRightIcon />
      </Text>
    </Flex>
  );
};

const ContentHeader = ({ onBack, title, content }) => {
  return (
    <Flex css={{ w: "100%", py: "$8", px: "$10", cursor: "pointer" }}>
      <Text
        css={{ p: "$2", bg: "$surfaceLight", r: "$round", alignSelf: "center" }}
        onClick={onBack}
      >
        <ChevronLeftIcon width={16} height={16} />
      </Text>
      <Box css={{ flex: "1 1 0", mx: "$8" }}>
        <Text variant="sm">{title}</Text>
        <Text variant="h6">{content}</Text>
      </Box>
      <IconButton onClick={onBack} css={{ alignSelf: "flex-start" }}>
        <CrossIcon width={16} height={16} />
      </IconButton>
    </Flex>
  );
};

const HLSStreaming = ({ onBack }) => {
  const { isHLSRunning } = useRecordingStreaming();
  return (
    <Box
      css={{
        size: "100%",
        zIndex: 2,
        position: "absolute",
        top: 0,
        left: 0,
        bg: "$surfaceDefault",
        transform: "translateX(10%)",
        animation: `${slideLeftAndFade("10%")} 100ms ease-out forwards`,
      }}
    >
      <ContentHeader title="Start Streaming" content="HLS" onBack={onBack} />
      <Box css={{ p: "$10" }}>
        <Text>
          <GoLiveIcon width={40} height={40} />
        </Text>
        <Text css={{ fontWeight: "$semiBold", mt: "$8", mb: "$4" }}>
          HLS Streaming
        </Text>
        <Text variant="sm" color="$textMedEmp">
          Stream directly from the browser using any device with multiple hosts
          and real-time messaging, all within this platform.
        </Text>
      </Box>
      {isHLSRunning ? <EndHLS /> : <StartHLS />}
    </Box>
  );
};

const StartHLS = () => {
  const [record, setRecord] = useState(false);
  const recordingUrl = useHMSStore(selectAppData(APP_DATA.recordingUrl));
  const hmsActions = useHMSActions();
  const toggleStreaming = useSidepaneToggle(SIDE_PANE_OPTIONS.STREAMING);
  const permissions = useHMSStore(selectPermissions);
  const startHLS = useCallback(async () => {
    await hmsActions.startHLSStreaming({
      variants: [{ meetingURL: recordingUrl || getDefaultMeetingUrl() }],
      recording: record
        ? { hlsVod: true, singleFilePerLayer: true }
        : undefined,
    });
    toggleStreaming();
  }, [recordingUrl, hmsActions, record, toggleStreaming]);

  return (
    <Fragment>
      {permissions.recording && (
        <Flex
          align="center"
          css={{ bg: "$surfaceLight", m: "$8 $10", p: "$8", r: "$0" }}
        >
          <Text css={{ color: "$error" }}>
            <RecordIcon />
          </Text>
          <Text variant="sm" css={{ flex: "1 1 0", mx: "$8" }}>
            Record the stream
          </Text>
          <Switch checked={record} onCheckedChange={setRecord} />
        </Flex>
      )}
      <Box css={{ p: "$4 $10" }}>
        <Button css={{ w: "100%", r: "$0" }} icon onClick={startHLS}>
          <GoLiveIcon />
          Go Live
        </Button>
      </Box>
      <Flex align="center" css={{ p: "$4 $10" }}>
        <Text>
          <InfoIcon width={16} height={16} />
        </Text>
        <Text variant="tiny" color="$textMedEmp" css={{ mx: "$8" }}>
          You cannot start recording once the stream starts, you will have to
          stop the stream to enable recording.
        </Text>
      </Flex>
    </Fragment>
  );
};

const EndHLS = () => {
  const hmsActions = useHMSActions();
  return (
    <Box css={{ p: "$4 $10" }}>
      <Button
        variant="danger"
        css={{ w: "100%", r: "$0", my: "$8" }}
        icon
        onClick={async () => {
          await hmsActions.stopHLSStreaming();
        }}
      >
        <EndStreamIcon />
        End Stream
      </Button>
    </Box>
  );
};
