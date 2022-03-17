import React, { useState } from "react";
import {
  Flex,
  Dropdown,
  Text,
  textEllipsis,
  Box,
  Tooltip,
} from "@100mslive/react-ui";
import {
  RecordIcon,
  GlobeIcon,
  MusicIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  AudioPlayerIcon,
  PencilDrawIcon,
} from "@100mslive/react-icons";
import { useRecordingStreaming } from "@100mslive/react-sdk";
import { usePlaylistMusic } from "../hooks/usePlaylistMusic";
import { useScreenshareAudio } from "../hooks/useScreenshareAudio";
import { useWhiteboardMetadata } from "../../plugins/whiteboard/useWhiteboardMetadata";

const getRecordingText = (
  { isBrowserRecordingOn, isServerRecordingOn, isHLSRecordingOn },
  delimiter = ", "
) => {
  if (!isBrowserRecordingOn && !isServerRecordingOn && !isHLSRecordingOn) {
    return "";
  }
  const title = [];
  if (isBrowserRecordingOn) {
    title.push("Browser");
  }
  if (isServerRecordingOn) {
    title.push("Server");
  }
  if (isHLSRecordingOn) {
    title.push("HLS");
  }
  return title.join(delimiter);
};

const getStreamingText = ({ isStreamingOn, isHLSRunning }) => {
  if (isStreamingOn) {
    return isHLSRunning ? "HLS" : "RTMP";
  }
};

/**
 * Display state of recording, streaming, playlist, whiteboard
 */
export const AdditionalRoomState = () => {
  const playlist = usePlaylistMusic();
  const {
    isServerRecordingOn,
    isBrowserRecordingOn,
    isHLSRecordingOn,
    isStreamingOn,
    isHLSRunning,
    isRecordingOn,
  } = useRecordingStreaming();
  const screenshareAudio = useScreenshareAudio();
  const [open, setOpen] = useState(false);
  const isPlaylistInactive = [
    !playlist.peer || !playlist.track,
    !playlist.peer?.isLocal && !playlist.track?.enabled,
    playlist.peer?.isLocal && !playlist.selection,
  ].some(Boolean);
  const isScreenshareInactive = [
    !screenshareAudio.peer || !screenshareAudio.track,
    !screenshareAudio.peer?.isLocal && !screenshareAudio.track?.enabled,
  ].some(Boolean);
  const { whiteboardOwner, amIWhiteboardOwner, toggleWhiteboard } =
    useWhiteboardMetadata();

  if (
    isPlaylistInactive &&
    isScreenshareInactive &&
    !isRecordingOn &&
    !isStreamingOn &&
    !whiteboardOwner
  ) {
    return null;
  }

  return (
    <Dropdown.Root open={open} onOpenChange={setOpen}>
      <Dropdown.Trigger asChild>
        <Flex
          align="center"
          css={{
            color: "$textPrimary",
            borderRadius: "$1",
            border: "1px solid $textDisabled",
            padding: "$2 $4",
          }}
        >
          {!isScreenshareInactive && (
            <Tooltip title="Screenshare Audio">
              <Flex align="center" css={{ color: "$textPrimary", mx: "$2" }}>
                <MusicIcon width={24} height={24} />
              </Flex>
            </Tooltip>
          )}
          {!isPlaylistInactive && (
            <Tooltip title="Playlist Music">
              <Flex align="center" css={{ color: "$textPrimary", mx: "$2" }}>
                <AudioPlayerIcon width={24} height={24} />
              </Flex>
            </Tooltip>
          )}
          {whiteboardOwner && (
            <Tooltip title="Whiteboard">
              <Flex align="center" css={{ color: "$textPrimary", mx: "$2" }}>
                <PencilDrawIcon width={24} height={24} />
              </Flex>
            </Tooltip>
          )}
          <Flex
            align="center"
            css={{
              color: "$error",
            }}
          >
            {isRecordingOn && (
              <Tooltip
                title={getRecordingText({
                  isBrowserRecordingOn,
                  isServerRecordingOn,
                  isHLSRecordingOn,
                })}
              >
                <Box>
                  <RecordIcon
                    width={24}
                    height={24}
                    style={{ marginRight: "0.25rem" }}
                  />
                </Box>
              </Tooltip>
            )}
            {isStreamingOn && (
              <Tooltip
                title={getStreamingText({ isStreamingOn, isHLSRunning })}
              >
                <Box>
                  <GlobeIcon width={24} height={24} />
                </Box>
              </Tooltip>
            )}
          </Flex>
          <Box css={{ "@lg": { display: "none" }, color: "$textDisabled" }}>
            {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Box>
        </Flex>
      </Dropdown.Trigger>
      <Dropdown.Content sideOffset={5} align="end" css={{ w: "$60" }}>
        {isRecordingOn && (
          <Dropdown.Item css={{ color: "$error" }}>
            <RecordIcon width={24} height={24} />
            <Text
              variant="sm"
              css={{ ml: "$2", flex: "1 1 0", ...textEllipsis("80%") }}
            >
              Recording (
              {getRecordingText(
                {
                  isBrowserRecordingOn,
                  isServerRecordingOn,
                  isHLSRecordingOn,
                },
                "|"
              )}
              )
            </Text>
          </Dropdown.Item>
        )}
        {isStreamingOn && (
          <Dropdown.Item css={{ color: "$error" }}>
            <GlobeIcon width={24} height={24} />
            <Text variant="sm" css={{ ml: "$2" }}>
              Streaming ({isHLSRunning ? "HLS" : "RTMP"})
            </Text>
          </Dropdown.Item>
        )}
        {(isRecordingOn || isStreamingOn) &&
          (!isPlaylistInactive ||
            !isScreenshareInactive ||
            whiteboardOwner) && <Dropdown.ItemSeparator />}
        {!isPlaylistInactive && (
          <Dropdown.Item css={{ color: "$textPrimary" }}>
            <AudioPlayerIcon width={24} height={24} />
            <Text variant="sm" css={{ ml: "$2", flex: "1 1 0" }}>
              Playlist is playing
            </Text>
            {playlist.peer.isLocal ? (
              <Text
                variant="sm"
                css={{ color: "$error", cursor: "pointer", ml: "$2" }}
                onClick={e => {
                  e.preventDefault();
                  playlist.selection.playing
                    ? playlist.pause()
                    : playlist.play(playlist.selection.id);
                }}
              >
                {playlist.selection.playing ? "Pause" : "Play"}
              </Text>
            ) : (
              <Text
                variant="sm"
                css={{ color: "$error", ml: "$2", cursor: "pointer" }}
                onClick={e => {
                  e.preventDefault();
                  playlist.setVolume(!playlist.track.volume ? 100 : 0);
                }}
              >
                {playlist.track.volume === 0 ? "Unmute" : "Mute"}
              </Text>
            )}
          </Dropdown.Item>
        )}
        {!isScreenshareInactive && (
          <Dropdown.Item css={{ color: "$textPrimary" }}>
            <MusicIcon width={24} height={24} />
            <Text variant="sm" css={{ ml: "$2", flex: "1 1 0" }}>
              Music is playing
            </Text>
            <Text
              variant="sm"
              css={{ color: "$error", ml: "$2", cursor: "pointer" }}
              onClick={e => {
                e.preventDefault();
                screenshareAudio.onToggle();
              }}
            >
              {screenshareAudio.muted ? "Unmute" : "Mute"}
            </Text>
          </Dropdown.Item>
        )}
        {whiteboardOwner && (
          <Dropdown.Item css={{ color: "$textPrimary" }}>
            <PencilDrawIcon width={24} height={24} />
            <Text variant="sm" css={{ ml: "$2", flex: "1 1 0" }}>
              Whiteboard Owner - {whiteboardOwner.name}
              {amIWhiteboardOwner && "(You)"}
            </Text>
            {amIWhiteboardOwner && (
              <Text
                variant="sm"
                css={{ color: "$error", ml: "$2", cursor: "pointer" }}
                onClick={e => {
                  e.preventDefault();
                  toggleWhiteboard();
                }}
              >
                Stop
              </Text>
            )}
          </Dropdown.Item>
        )}
      </Dropdown.Content>
    </Dropdown.Root>
  );
};
