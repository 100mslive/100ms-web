import { Fragment, useState } from "react";
import {
  selectPermissions,
  useHMSStore,
  useRecordingStreaming,
} from "@100mslive/react-sdk";
import { ColoredHandIcon, CrossIcon, GoLiveIcon } from "@100mslive/react-icons";
import { Box, Flex, IconButton, Text } from "@100mslive/react-ui";
import { StreamCard } from "./Common";
import { HLSStreaming } from "./HLSStreaming";
import { RTMPIcon } from "./RTMPIcon";
import { RTMPStreaming } from "./RTMPStreaming";
import { useSidepaneToggle } from "../AppData/useSidepane";
import { SIDE_PANE_OPTIONS } from "../../common/constants";

export const StreamingLanding = () => {
  const toggleStreaming = useSidepaneToggle(SIDE_PANE_OPTIONS.STREAMING);
  const { isHLSRunning, isRTMPRunning } = useRecordingStreaming();
  const permissions = useHMSStore(selectPermissions);
  const [showHLS, setShowHLS] = useState(isHLSRunning);
  const [showRTMP, setShowRTMP] = useState(isRTMPRunning);

  if (!permissions?.hlsStreaming && !permissions?.rtmpStreaming) {
    toggleStreaming();
    return null;
  }

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
        <IconButton
          onClick={toggleStreaming}
          css={{ alignSelf: "flex-start" }}
          data-testid="close_streaming"
        >
          <CrossIcon />
        </IconButton>
      </Flex>
      <Text variant="tiny" color="$textMedEmp">
        Start Streaming
      </Text>
      {permissions?.hlsStreaming && (
        <StreamCard
          testId="hls_stream"
          title="Live Stream with HLS"
          subtitle="Stream to millions, edit and control what the viewer sees and more!"
          css={{ my: "$8" }}
          onClick={() => setShowHLS(true)}
          Icon={GoLiveIcon}
        />
      )}
      {permissions?.rtmpStreaming && (
        <StreamCard
          testId="rtmp_stream"
          title="Stream live to Facebook, Twitch, and others"
          subtitle="Stream to a specific destination directly from your app."
          css={{ my: "$8" }}
          onClick={() => {
            setShowRTMP(true);
          }}
          Icon={RTMPIcon}
        />
      )}
      {showHLS && <HLSStreaming onBack={() => setShowHLS(false)} />}
      {showRTMP && <RTMPStreaming onBack={() => setShowRTMP(false)} />}
    </Fragment>
  );
};
