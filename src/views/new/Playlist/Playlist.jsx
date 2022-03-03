import React, { Fragment, useState } from "react";
import {
  AudioPlayerIcon,
  CrossIcon,
  VideoPlayerIcon,
} from "@100mslive/react-icons";
import {
  Dropdown,
  IconButton,
  Text,
  Flex,
  Tooltip,
  Box,
  VerticalDivider,
} from "@100mslive/react-ui";
import {
  HMSPlaylistType,
  selectAudioPlaylist,
  selectVideoPlaylist,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { PlaylistItem } from "./PlaylistItem";
import { PlaylistControls } from "./PlaylistControls";

export const Playlist = ({ type }) => {
  const isAudioPlaylist = type === HMSPlaylistType.audio;
  const selector = isAudioPlaylist ? selectAudioPlaylist : selectVideoPlaylist;
  const playlist = useHMSStore(selector.list);
  const active = useHMSStore(selector.selectedItem);
  const hmsActions = useHMSActions();
  const action = isAudioPlaylist
    ? hmsActions.audioPlaylist
    : hmsActions.videoPlaylist;
  const [open, setOpen] = useState(false);
  const [collapse, setCollapse] = useState(false);

  if (playlist.length === 0) {
    return null;
  }

  return (
    <Fragment>
      <Dropdown.Root open={open} onOpenChange={setOpen}>
        <Dropdown.Trigger asChild>
          <IconButton active={!active}>
            <Tooltip
              title={isAudioPlaylist ? "Audio Playlist" : "Video Playlist"}
            >
              <Box>
                {isAudioPlaylist ? <AudioPlayerIcon /> : <VideoPlayerIcon />}
              </Box>
            </Tooltip>
          </IconButton>
        </Dropdown.Trigger>
        <Dropdown.Content
          sideOffset={5}
          align="center"
          css={{
            maxHeight: "unset",
            width: "$60",
            p: "$0",
            bg: "$bgSecondary",
            border: "1px solid $menuBg",
          }}
        >
          <Flex
            align="center"
            css={{
              p: "$4 $8",
              borderBottom: "1px solid $borderLight",
              bg: "$menuBg",
            }}
          >
            <Text variant="md" css={{ flex: "1 1 0" }}>
              {isAudioPlaylist ? "Audio Player" : "Video Playlist"}
            </Text>
            <IconButton
              css={{ mr: "-$4" }}
              onClick={() => {
                if (active) {
                  hmsActions.audioPlaylist.stop();
                }
                setOpen(false);
                setCollapse(false);
              }}
            >
              <CrossIcon width={24} height={24} />
            </IconButton>
          </Flex>
          {!collapse && (
            <Box css={{ maxHeight: "$96", overflowY: "auto" }}>
              {playlist.map(playlistItem => {
                return (
                  <PlaylistItem
                    key={playlistItem.id}
                    {...playlistItem}
                    onClick={e => {
                      e.preventDefault();
                      action.play(playlistItem.id);
                    }}
                  />
                );
              })}
            </Box>
          )}
          {isAudioPlaylist && (
            <PlaylistControls
              type={HMSPlaylistType.audio}
              onToggle={() => setCollapse(value => !value)}
            />
          )}
        </Dropdown.Content>
      </Dropdown.Root>
      <VerticalDivider space={4} />
    </Fragment>
  );
};
