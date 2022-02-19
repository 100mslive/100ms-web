import React, { Fragment, useContext } from "react";
import {
  Flex,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  IconButton,
  DropdownItemSeparator,
  Text,
  textEllipsis,
  Box,
  Tooltip,
  styled,
} from "@100mslive/react-ui";
import {
  ChevronDownIcon,
  RecordIcon,
  SpeakerIcon,
  GlobeIcon,
  MusicIcon,
} from "@100mslive/react-icons";
import { useHMSStore, selectDominantSpeaker } from "@100mslive/react-sdk";
import { ParticipantList } from "./ParticipantList";
import PIPComponent from "../PIP/PIPComponent";
import { usePlaylistMusic } from "../hooks/usePlaylistMusic";
import { useRecordingStreaming } from "../hooks/useRecordingStreaming";
import { getRecordingText, getStreamingText } from "../../common/utils";
import { AppContext } from "../../store/AppContext";

const SpeakerTag = () => {
  const dominantSpeaker = useHMSStore(selectDominantSpeaker);
  return dominantSpeaker && dominantSpeaker.name ? (
    <Flex
      align="center"
      justify="center"
      css={{ flex: "1 1 0", color: "$textPrimary" }}
    >
      <SpeakerIcon width={24} height={24} />
      <Text
        variant="md"
        css={{ ...textEllipsis(200), ml: "$2" }}
        title={dominantSpeaker.name}
      >
        {dominantSpeaker.name}
      </Text>
    </Flex>
  ) : (
    <></>
  );
};

const PlaylistAndStreaming = () => {
  const playlist = usePlaylistMusic();
  const {
    isServerRecordingOn,
    isBrowserRecordingOn,
    isHLSRecordingOn,
    isStreamingOn,
    isHLSRunning,
  } = useRecordingStreaming();
  const isRecordingOn =
    isServerRecordingOn || isBrowserRecordingOn || isHLSRecordingOn;

  if (!playlist && !isRecordingOn && !isStreamingOn) {
    return null;
  }

  return (
    <Fragment>
      {playlist && (
        <Tooltip title="Playlist Music">
          <Flex align="center" css={{ color: "$textPrimary", mx: "$2" }}>
            <MusicIcon width={24} height={24} />
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
          <Tooltip title={getStreamingText({ isStreamingOn, isHLSRunning })}>
            <Box>
              <GlobeIcon width={24} height={24} />
            </Box>
          </Tooltip>
        )}
      </Flex>
      <Dropdown>
        <DropdownTrigger asChild>
          <IconButton
            css={{
              mr: "$2",
              alignSelf: "center",
            }}
          >
            <ChevronDownIcon />
          </IconButton>
        </DropdownTrigger>
        <DropdownContent sideOffset={5} align="end" css={{ w: "$60" }}>
          {isRecordingOn && (
            <DropdownItem css={{ color: "$error" }}>
              <RecordIcon width={24} height={24} />
              <Text
                variant="sm"
                css={{ ml: "$2", flex: "1 1 0", ...textEllipsis("80%") }}
              >
                Recording(
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
            </DropdownItem>
          )}
          {isStreamingOn && (
            <DropdownItem css={{ color: "$error" }}>
              <GlobeIcon width={24} height={24} />
              <Text variant="sm" css={{ ml: "$2" }}>
                Streaming ({isHLSRunning ? "HLS" : "RTMP"})
              </Text>
            </DropdownItem>
          )}
          {(isRecordingOn || isStreamingOn) && playlist && (
            <DropdownItemSeparator />
          )}
          {playlist && (
            <DropdownItem css={{ color: "$textPrimary" }}>
              <MusicIcon width={24} height={24} />
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
                    playlist.setVolume(
                      !playlist.track.volume ? 100 : 0,
                      playlist.track.id
                    );
                  }}
                >
                  {playlist.track.volume === 0 ? "Unmute" : "Mute"}
                </Text>
              )}
            </DropdownItem>
          )}
        </DropdownContent>
      </Dropdown>
    </Fragment>
  );
};

const PlaylistMusic = () => {
  const playlist = usePlaylistMusic();

  if (!playlist) {
    return null;
  }
  const { peer, selection, track, play, pause, setVolume } = playlist;

  return (
    <Flex
      align="center"
      css={{ color: "$textPrimary", ml: "$4", "@lg": { display: "none" } }}
    >
      <MusicIcon width={24} height={24} />
      <Text variant="md" css={{ mx: "$2" }}>
        Playlist is playing
      </Text>
      {peer.isLocal ? (
        <Text
          variant="md"
          onClick={async () => {
            if (selection.playing) {
              pause();
            } else {
              await play(selection.id);
            }
          }}
          css={{ color: "$error", cursor: "pointer" }}
        >
          {selection.playing ? "Pause" : "Play"}
        </Text>
      ) : (
        <Text
          variant="md"
          onClick={() => {
            setVolume(!track.volume ? 100 : 0, track.id);
          }}
          css={{ color: "$error", cursor: "pointer" }}
        >
          {track.volume === 0 ? "Unmute" : "Mute"}
        </Text>
      )}
    </Flex>
  );
};

const StreamingRecording = () => {
  const {
    isServerRecordingOn,
    isBrowserRecordingOn,
    isHLSRecordingOn,
    isStreamingOn,
    isHLSRunning,
  } = useRecordingStreaming();
  const isRecordingOn =
    isServerRecordingOn || isBrowserRecordingOn || isHLSRecordingOn;

  return (
    <Flex align="center" css={{ mx: "$4", "@lg": { display: "none" } }}>
      {isRecordingOn && (
        <Tooltip
          title={getRecordingText({
            isBrowserRecordingOn,
            isServerRecordingOn,
            isHLSRecordingOn,
          })}
        >
          <Flex align="center" css={{ color: "$error" }}>
            <RecordIcon width={24} height={24} />
            <Text variant="body" css={{ mx: "$2" }}>
              Recording
            </Text>
          </Flex>
        </Tooltip>
      )}
      {isStreamingOn && (
        <Tooltip title={getStreamingText({ isStreamingOn, isHLSRunning })}>
          <Flex align="center" css={{ mx: "$2", color: "$error" }}>
            <GlobeIcon width={24} height={24} />
            <Text variant="body" css={{ mx: "$2" }}>
              Streaming
            </Text>
          </Flex>
        </Tooltip>
      )}
    </Flex>
  );
};

const LogoImg = styled("img", {
  maxHeight: "$14",
  "@md": {
    maxHeight: "$12",
  },
});

const Logo = () => {
  const { logo } = useContext(AppContext);
  return <LogoImg src={logo} alt="Brand Logo" />;
};

export const Header = () => {
  return (
    <Flex
      justify="between"
      align="center"
      css={{ position: "relative", height: "100%" }}
    >
      <Flex align="center" css={{ position: "absolute", left: "$4" }}>
        <Logo />
        <PlaylistMusic />
        <StreamingRecording />
      </Flex>
      <SpeakerTag />
      <Flex align="center" css={{ position: "absolute", right: "$4" }}>
        <Flex
          align="center"
          css={{ display: "none", "@lg": { display: "flex" } }}
        >
          <PlaylistAndStreaming />
        </Flex>

        <PIPComponent />
        <Box css={{ mx: "$2" }}>
          <ParticipantList />
        </Box>
      </Flex>
    </Flex>
  );
};
