import React, { useRef } from "react";
import { useFullscreen, useToggle } from "react-use";
import screenfull from "screenfull";
import {
  selectLocalPeerID,
  selectVideoPlaylistVideoTrackByPeerID,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { ShrinkIcon, ExpandIcon, CrossIcon } from "@100mslive/react-icons";
import { Box, IconButton, Video } from "@100mslive/react-ui";
import { VideoPlaylistControls } from "./PlaylistControls";

export const VideoPlayer = ({ peerId }) => {
  const videoTrack = useHMSStore(selectVideoPlaylistVideoTrackByPeerID(peerId));
  const localPeerId = useHMSStore(selectLocalPeerID);
  const hmsActions = useHMSActions();
  const ref = useRef(null);
  const [show, toggle] = useToggle(false);
  const isFullscreen = useFullscreen(ref, show, {
    onClose: () => toggle(false),
  });
  return (
    <Box css={{ position: "relative", w: "100%", h: "100%" }} ref={ref}>
      <Video trackId={videoTrack?.id} />
      {videoTrack.peerId === localPeerId && (
        <IconButton
          css={{
            position: "absolute",
            top: "$8",
            right: "$8",
            color: "$white",
          }}
          onClick={() => {
            hmsActions.videoPlaylist.stop();
          }}
        >
          <CrossIcon />
        </IconButton>
      )}
      <VideoPlaylistControls>
        {screenfull.enabled && (
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
        )}
      </VideoPlaylistControls>
    </Box>
  );
};
