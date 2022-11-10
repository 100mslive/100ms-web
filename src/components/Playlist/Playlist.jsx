import React, { Fragment, useState } from "react";
import {
  HMSPlaylistType,
  selectIsAllowedToPublish,
  useHMSStore,
} from "@100mslive/react-sdk";
import {
  AudioPlayerIcon,
  CrossIcon,
  VideoPlayerIcon,
} from "@100mslive/react-icons";
import { Box, Dropdown, Flex, Text, Tooltip } from "@100mslive/react-ui";
import IconButton from "../../IconButton";
import { AudioPlaylistControls } from "./PlaylistControls";
import { PlaylistItem } from "./PlaylistItem";
import { usePlaylist } from "../hooks/usePlaylist";

const BrowseAndPlayFromLocal = ({ type, actions }) => {
  return (
    <Fragment>
      <Text
        as="label"
        htmlFor={`${type}PlaylistBrowse`}
        variant="sm"
        css={{ cursor: "pointer", mr: "$2" }}
      >
        Browse
      </Text>
      <input
        type="file"
        id={`${type}PlaylistBrowse`}
        accept={type === HMSPlaylistType.audio ? "audio/*" : "video/*"}
        onChange={e => {
          const file = e.target.files[0];
          const id = file.lastModified;
          actions.setList([
            {
              type,
              id,
              name: file.name,
              url: URL.createObjectURL(file),
            },
          ]);
          actions.play(id);
        }}
        style={{ display: "none" }}
      />
    </Fragment>
  );
};

export const Playlist = ({ type }) => {
  const isAudioPlaylist = type === HMSPlaylistType.audio;
  const { active, list: playlist, actions } = usePlaylist(type);
  const [open, setOpen] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  if (!isAllowedToPublish.screen || playlist.length === 0) {
    return null;
  }

  return (
    <Fragment>
      <Dropdown.Root open={open} onOpenChange={setOpen}>
        <Dropdown.Trigger
          asChild
          data-testid={
            type === HMSPlaylistType.audio ? "audio_playlist" : "video_playlist"
          }
        >
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
            <BrowseAndPlayFromLocal type={type} actions={actions} />
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
