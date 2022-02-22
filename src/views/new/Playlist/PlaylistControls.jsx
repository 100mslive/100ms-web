import React from "react";
import {
  HMSPlaylistType,
  selectAudioPlaylist,
  selectVideoPlaylist,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import {
  PrevIcon,
  NextIcon,
  PlayIcon,
  PauseIcon,
  PlaylistIcon,
} from "@100mslive/react-icons";
import { Box, Flex, IconButton, Slider, Text } from "@100mslive/react-ui";

const PlaylistProgress = ({ type, duration }) => {
  const selectPlaylist =
    type === HMSPlaylistType.audio ? selectAudioPlaylist : selectVideoPlaylist;
  const progress = useHMSStore(selectPlaylist.progress);
  const hmsActions = useHMSActions();
  const playlistAction =
    type === HMSPlaylistType.audio
      ? hmsActions.audioPlaylist
      : hmsActions.videoPlaylist;

  if (!duration) {
    return null;
  }

  return (
    <Slider
      step={1}
      value={[progress]}
      onValueChange={e => {
        playlistAction.seekTo(e[0] * 0.01 * duration);
      }}
    />
  );
};

export const PlaylistControls = ({ type, onToggle }) => {
  const selector =
    type === HMSPlaylistType.audio ? selectAudioPlaylist : selectVideoPlaylist;
  const active = useHMSStore(selector.selectedItem);
  const selection = useHMSStore(selector.selection);
  const hmsActions = useHMSActions();
  const playlistAction =
    type === HMSPlaylistType.audio
      ? hmsActions.audioPlaylist
      : hmsActions.videoPlaylist;
  if (!active) {
    return null;
  }
  return (
    <Box css={{ p: "$8", borderTop: "1px solid $borderLight", bg: "$menuBg" }}>
      <Flex justify="center">
        <IconButton
          disabled={!selection.hasPrevious}
          onClick={() => {
            playlistAction.playPrevious();
          }}
        >
          <PrevIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            active.playing
              ? playlistAction.pause()
              : playlistAction.play(active.id);
          }}
        >
          {active.playing ? (
            <PauseIcon width={32} height={32} />
          ) : (
            <PlayIcon width={32} height={32} />
          )}
        </IconButton>
        <IconButton
          disabled={!selection.hasNext}
          onClick={() => {
            playlistAction.playNext();
          }}
        >
          <NextIcon />
        </IconButton>
      </Flex>
      <PlaylistProgress type={type} duration={active.duration} />
      <Box css={{ mt: "$8" }}>
        <Flex justify="between" css={{ w: "100%" }}>
          <Box>
            <Text variant="md">{active.name}</Text>
            {active.metadata?.description && (
              <Text variant="xs">{active.metadata?.description}</Text>
            )}
          </Box>
          <IconButton onClick={onToggle} css={{ alignSelf: "center" }}>
            <PlaylistIcon />
          </IconButton>
        </Flex>
      </Box>
    </Box>
  );
};
