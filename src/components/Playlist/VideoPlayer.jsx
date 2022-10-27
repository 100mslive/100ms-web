import React, { useRef } from "react";
import { useFullscreen, useToggle } from "react-use";
import screenfull from "screenfull";
import {
  selectVideoPlaylist,
  selectVideoPlaylistVideoTrackByPeerID,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { CrossIcon, ExpandIcon, ShrinkIcon } from "@100mslive/react-icons";
import { Flex, IconButton, Text, Video } from "@100mslive/react-ui";
import { VideoPlaylistControls } from "./PlaylistControls";
import { useUISettings } from "../AppData/useUISettings";
import { UI_SETTINGS } from "../../common/constants";

export const VideoPlayer = React.memo(({ peerId }) => {
  const videoTrack = useHMSStore(selectVideoPlaylistVideoTrackByPeerID(peerId));
  const active = useHMSStore(selectVideoPlaylist.selectedItem);
  const isAudioOnly = useUISettings(UI_SETTINGS.isAudioOnly);
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
        <Flex
          justify="between"
          align="center"
          css={{
            bg: "$menuBg",
            p: "$2 $2 $2 $6",
            borderTopLeftRadius: "$1",
            borderTopRightRadius: "$1",
          }}
        >
          <Text css={{ color: "$textPrimary" }}>{active.name}</Text>
          <IconButton
            css={{
              color: "$white",
            }}
            onClick={() => {
              hmsActions.videoPlaylist.stop();
            }}
            data-testid="videoplaylist_cross_btn"
          >
            <CrossIcon />
          </IconButton>
        </Flex>
      )}
      <Video
        trackId={videoTrack?.id}
        attach={!isAudioOnly}
        css={{
          "@lg": { objectFit: "contain", h: "auto" },
          r: "$1",
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      />
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
    </Flex>
  );
});
