import React from "react";
import {
  HMSPlaylistType,
  selectAudioPlaylist,
  selectAudioTrackVolume,
  selectPeerSharingVideoPlaylist,
  selectVideoPlaylist,
  selectVideoPlaylistAudioTrackByPeerID,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import {
  NextIcon,
  PauseIcon,
  PlayIcon,
  PlaylistIcon,
  PrevIcon,
  SpeakerIcon,
} from "@100mslive/react-icons";
import { Box, Flex, IconButton, Slider, Text } from "@100mslive/react-ui";
import { usePlaylist } from "../hooks/usePlaylist";

const Progress = ({ type, duration }) => {
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

export const PlaylistActive = ({ type, onToggle }) => {
  const isAudioPlaylist = type === HMSPlaylistType.audio;
  const selector = isAudioPlaylist ? selectAudioPlaylist : selectVideoPlaylist;
  const active = useHMSStore(selector.selectedItem);
  if (!active) {
    return null;
  }
  return (
    <Box css={{ mt: "$8" }}>
      <Flex justify="between" css={{ w: "100%" }}>
        <Box>
          <Text variant="md">{active.name}</Text>
          {active.metadata?.description && (
            <Text variant="xs">{active.metadata?.description}</Text>
          )}
        </Box>
        <IconButton
          onClick={onToggle}
          css={{ alignSelf: "center" }}
          data-testid="playlist_collapse_btn"
        >
          <PlaylistIcon />
        </IconButton>
      </Flex>
    </Box>
  );
};

const Controls = ({ type, css = {} }) => {
  const { active, hasNext, hasPrevious, actions } = usePlaylist(type);
  if (!active) {
    return null;
  }
  return (
    <Flex justify="center" css={css}>
      <IconButton
        disabled={!hasPrevious}
        onClick={() => {
          actions.playPrevious();
        }}
        data-testid="playlist_prev_btn"
      >
        <PrevIcon />
      </IconButton>
      <IconButton
        onClick={() => {
          active.playing ? actions.pause() : actions.play(active.id);
        }}
        data-testid="playlist_play_pause_btn"
      >
        {active.playing ? (
          <PauseIcon width={32} height={32} />
        ) : (
          <PlayIcon width={32} height={32} />
        )}
      </IconButton>
      <IconButton
        disabled={!hasNext}
        onClick={() => {
          actions.playNext();
        }}
        data-testid="playlist_next_btn"
      >
        <NextIcon />
      </IconButton>
    </Flex>
  );
};

const VolumeControl = () => {
  const hmsActions = useHMSActions();
  const volume = useHMSStore(selectVideoPlaylist.volume);
  const active = useHMSStore(selectVideoPlaylist.selectedItem);
  const peerSharingPlaylist = useHMSStore(selectPeerSharingVideoPlaylist);
  const audioTrack = useHMSStore(
    selectVideoPlaylistAudioTrackByPeerID(peerSharingPlaylist?.id)
  );
  const audioTrackVolume = useHMSStore(selectAudioTrackVolume(audioTrack?.id));
  const sliderVolume = active ? volume : audioTrackVolume;

  return (
    <Flex align="center" css={{ color: "$white" }}>
      <SpeakerIcon />
      <Slider
        css={{ mx: "$4", w: "$20" }}
        min={0}
        max={100}
        step={1}
        value={[Math.floor(sliderVolume)]}
        onValueChange={e => {
          const value = e[0];
          if (active) {
            hmsActions.videoPlaylist.setVolume(value);
          } else if (audioTrack) {
            hmsActions.setVolume(value, audioTrack.id);
          }
        }}
        thumbStyles={{ w: "$6", h: "$6" }}
      />
    </Flex>
  );
};

export const AudioPlaylistControls = ({ onToggle }) => {
  const { active } = usePlaylist(HMSPlaylistType.audio);
  if (!active) {
    return null;
  }
  return (
    <Box
      css={{
        p: "$8",
        borderTop: "1px solid $borderLight",
        bg: "$menuBg",
      }}
    >
      <Controls type={HMSPlaylistType.audio} />
      <Progress type={HMSPlaylistType.audio} duration={active.duration} />
      <PlaylistActive type={HMSPlaylistType.audio} onToggle={onToggle} />
    </Box>
  );
};

export const VideoPlaylistControls = ({ children }) => {
  const { active } = usePlaylist(HMSPlaylistType.video);

  return (
    <Box
      css={{
        p: "$8",
        mt: "-$24",
        w: "100%",
        zIndex: 1,
        "@lg": {
          mt: 0,
          p: "$6",
        },
      }}
    >
      {active && (
        <Progress type={HMSPlaylistType.video} duration={active.duration} />
      )}
      <Flex align="center" justify="between">
        <VolumeControl />
        {active && <Controls css={{ flex: "1 1 0" }} />}
        {children}
      </Flex>
    </Box>
  );
};
