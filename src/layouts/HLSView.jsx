import React, { useEffect, useRef, Fragment } from "react";
import { useHMSStore, selectHLSState } from "@100mslive/react-sdk";
import { Box, Flex, styled, Text } from "@100mslive/react-ui";
import Hls from "hls.js";
import { ChatView } from "../components/chatView";
import { FeatureFlags } from "../services/FeatureFlags";

const HLSVideo = styled("video", {
  h: "100%",
  margin: "0 auto",
});

export const HLSView = ({ isChatOpen, toggleChat }) => {
  const videoRef = useRef(null);
  const hlsState = useHMSStore(selectHLSState);
  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported() && hlsState.variants[0]?.url) {
        let hls = new Hls(getHLSConfig());
        hls.loadSource(hlsState.variants[0].url);
        hls.attachMedia(videoRef.current);
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        videoRef.current.src = hlsState.variants[0].url;
      }
    }
  }, [hlsState]);

  return (
    <Fragment>
      {hlsState.variants[0]?.url ? (
        <HLSVideo ref={videoRef} autoPlay controls />
      ) : (
        <Flex align="center" justify="center" css={{ size: "100%" }}>
          <Text variant="md" css={{ textAlign: "center" }}>
            Waiting for the Streaming to start...
          </Text>
        </Flex>
      )}
      {isChatOpen && (
        <Box
          css={{
            height: "50%",
            position: "absolute",
            zIndex: 40,
            bottom: "$20",
            right: 0,
            width: "20%",
            "@sm": {
              width: "75%",
            },
          }}
        >
          <ChatView toggleChat={toggleChat} />
        </Box>
      )}
    </Fragment>
  );
};

function getHLSConfig() {
  if (FeatureFlags.optimiseHLSLatency()) {
    // should reduce the latency by around 2-3 more seconds. Won't work well without good internet.
    return {
      enableWorker: true,
      liveSyncDuration: 1,
      liveMaxLatencyDuration: 5,
      liveDurationInfinity: true,
      highBufferWatchdogPeriod: 1,
    };
  }
  return {};
}
