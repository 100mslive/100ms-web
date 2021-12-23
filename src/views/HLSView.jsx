import React, { useEffect, useRef, Fragment } from "react";
import {
  isMobileDevice,
  selectHLSState,
  selectPeerCount,
  Text,
  useHMSStore,
} from "@100mslive/hms-video-react";
import Hls from "hls.js";
import { getBlurClass } from "../common/utils";
import { ChatView } from "./components/chatView";

const defaultClasses = {
  HLSVideo: "w-full contain h-full",
  NoURLText: "flex items-center justify-center w-full h-full",
};

export const HLSView = ({ isChatOpen, toggleChat, isParticipantListOpen }) => {
  const videoRef = useRef(null);
  const peersCount = useHMSStore(selectPeerCount);
  const hlsState = useHMSStore(selectHLSState);
  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported() && hlsState.variants[0]?.url) {
        let hls = new Hls();
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
        ></video>
      ) : (
        <div className={defaultClasses.NoURLText}>
          <Text
            variant="heading"
            size="lg"
            classes={{ root: "light:text-black dark:text-white text-center" }}
          >
            No HLS URL Present
          </Text>
        </div>
      )}
      {isChatOpen && (
        <div
          className={`h-1/2 ${
            isMobileDevice() ? `w-3/4` : `w-2/10`
          } absolute z-40 bottom-20 right-0 ${getBlurClass(
            isParticipantListOpen,
            peersCount
          )}`}
        >
          <ChatView toggleChat={toggleChat} />
        </div>
      )}
    </Fragment>
  );
};
