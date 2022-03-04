import React, { useRef } from "react";
import { useFullscreen, useToggle } from "react-use";
import {
  selectVideoPlaylist,
  selectVideoPlaylistVideoTrackByPeerID,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { ShrinkIcon, ExpandIcon, CrossIcon } from "@100mslive/react-icons";
import { Flex, IconButton, Text, Video } from "@100mslive/react-ui";
import { VideoPlaylistControls } from "./PlaylistControls";

export const VideoPlayer = ({ peerId }) => {
  const videoTrack = useHMSStore(selectVideoPlaylistVideoTrackByPeerID(peerId));
  const active = useHMSStore(selectVideoPlaylist.selectedItem);
  const hmsActions = useHMSActions();
  const ref = useRef(null);
  const [show, toggle] = useToggle(false);
  const isFullscreen = useFullscreen(ref, show, {
    onClose: () => toggle(false),
  });
  return (
    <Flex
      direction="column"
      justify="center"
      css={{ w: "100%", h: "100%" }}
      ref={ref}
    >
      {active && (
        <Flex justify="between" css={{ bg: "$bgPrimary", p: "$2 $4" }}>
          <Text css={{ color: "$textPrimary" }}>{active.name}</Text>
          <IconButton
            css={{
              color: "$white",
            }}
            onClick={() => {
              hmsActions.videoPlaylist.stop();
            }}
          >
            <CrossIcon />
          </IconButton>
        </Flex>
      )}
      <Video
        trackId={videoTrack?.id}
        css={{
          "@lg": { objectFit: "contain", h: "auto" },
          r: 0,
        }}
      />
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
    </Flex>
  );
};
