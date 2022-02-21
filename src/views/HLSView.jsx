import React, { useEffect, useRef, Fragment } from "react";
import {
  isMobileDevice,
  selectHLSState,
  Text,
  useHMSStore,
} from "@100mslive/hms-video-react";
import Hls from "hls.js";
import { ChatView } from "./components/chatView";
import { FeatureFlags } from "../store/FeatureFlags";

const defaultClasses = {
  HLSVideo: "h-full m-auto",
};

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
        <video
          className={defaultClasses.HLSVideo}
          ref={videoRef}
          autoPlay
          controls
        />
      ) : (
        <div className="flex items-center justify-center w-full">
          <Text
            variant="heading"
            size="lg"
            classes={{ root: "light:text-black dark:text-white text-center" }}
          >
            Waiting for the Streaming to start...
          </Text>
        </div>
      )}
      {isChatOpen && (
        <div
          className={`h-1/2 ${
            isMobileDevice() ? `w-3/4` : `w-2/10`
          } absolute z-40 bottom-20 right-0`}
        >
          <ChatView toggleChat={toggleChat} />
        </div>
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
