import React, { useRef } from "react";
import { useFullscreen, useToggle } from "react-use";
import {
  selectVideoPlaylistVideoTrackByPeerID,
  useHMSStore,
} from "@100mslive/react-sdk";
import { ShrinkIcon, ExpandIcon } from "@100mslive/react-icons";
import { Box, IconButton, Video } from "@100mslive/react-ui";
import { VideoPlaylistControls } from "./PlaylistControls";

export const VideoPlayer = ({ peerId }) => {
  const videoTrack = useHMSStore(selectVideoPlaylistVideoTrackByPeerID(peerId));
  const ref = useRef(null);
  const [show, toggle] = useToggle(false);
  const isFullscreen = useFullscreen(ref, show, {
    onClose: () => toggle(false),
  });
  return (
    <Box css={{ position: "relative", w: "100%", h: "100%" }} ref={ref}>
      <Video trackId={videoTrack?.id} />
      <VideoPlaylistControls>
        <IconButton
          onClick={() => toggle()}
          css={{
            color: "$white",
            height: "max-content",
            alignSelf: "center",
            cursor: "pointer",
          }}
        >
          {isFullscreen ? <ShrinkIcon /> : <ExpandIcon />}
        </IconButton>
      </VideoPlaylistControls>
    </Box>
  );
};
