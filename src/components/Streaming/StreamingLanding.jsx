import { Fragment, useState } from "react";
import { CrossIcon, ColoredHandIcon, GoLiveIcon } from "@100mslive/react-icons";
import { Flex, Box, Text, IconButton } from "@100mslive/react-ui";
import { RTMPIcon } from "./RTMPIcon";
import { StreamCard } from "./Common";
import { HLSStreaming } from "./HLSStreaming";
import { RTMPStreaming } from "./RTMPStreaming";
import { useSidepaneToggle } from "../AppData/useSidepane";
import { SIDE_PANE_OPTIONS } from "../../common/constants";

export const StreamingLanding = () => {
  const toggleStreaming = useSidepaneToggle(SIDE_PANE_OPTIONS.STREAMING);
  const [showHLS, setShowHLS] = useState(false);
  const [showRTMP, setShowRTMP] = useState(false);

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
        Icon={GoLiveIcon}
      />
      <StreamCard
        title="Stream live to Facebook, Twitch, and others"
        subtitle="Stream to a specific destination directly from your app."
        css={{ my: "$8" }}
        onClick={() => {
          setShowRTMP(true);
        }}
        Icon={RTMPIcon}
      />
      {showHLS && <HLSStreaming onBack={() => setShowHLS(false)} />}
      {showRTMP && <RTMPStreaming onBack={() => setShowRTMP(false)} />}
    </Fragment>
  );
};
