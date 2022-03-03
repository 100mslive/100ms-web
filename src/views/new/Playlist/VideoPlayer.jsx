import React from "react";
import { Box, Video } from "@100mslive/react-ui";
import {
  selectVideoPlaylistVideoTrackByPeerID,
  useHMSStore,
} from "@100mslive/react-sdk";

export const VideoPlayer = ({ peerId }) => {
  const videoTrack = useHMSStore(selectVideoPlaylistVideoTrackByPeerID(peerId));
  return <Video trackId={videoTrack?.id} />;
};
