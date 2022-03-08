import React, { Fragment, useState } from "react";
import { HMSPlaylistType } from "@100mslive/react-sdk";
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
} from "@100mslive/react-ui";
import { PlaylistItem } from "./PlaylistItem";
import { AudioPlaylistControls } from "./PlaylistControls";
import { usePlaylist } from "../hooks/usePlaylist";

export const Playlist = ({ type }) => {
  const isAudioPlaylist = type === HMSPlaylistType.audio;
  const { active, list: playlist, actions } = usePlaylist(type);
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
              onClick={async () => {
                if (active) {
                  await actions.stop();
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
                    onClick={async e => {
                      e.preventDefault();
                      await actions.play(playlistItem.id);
                      // Close the dropdown list for videoplaylist
                      if (!isAudioPlaylist) {
                        setOpen(false);
                      }
                    }}
                  />
                );
              })}
            </Box>
          )}
          {isAudioPlaylist && (
            <AudioPlaylistControls
              onToggle={() => setCollapse(value => !value)}
            />
          )}
        </Dropdown.Content>
      </Dropdown.Root>
    </Fragment>
  );
};
