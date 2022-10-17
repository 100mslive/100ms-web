import React, { Fragment } from "react";
import {
  HorizontalMenuIcon,
  MicOffIcon,
  VideoOffIcon,
  VideoOnIcon,
  MicOnIcon,
  SpeakerIcon,
  RemoveUserIcon,
  ShareScreenIcon,
} from "@100mslive/react-icons";
import {
  useHMSStore,
  selectPermissions,
  useHMSActions,
  useRemoteAVToggle,
  useCustomEvent,
  selectTrackByID,
} from "@100mslive/react-sdk";
import { Flex, StyledMenuTile, Slider, Text, Box } from "@100mslive/react-ui";
import { ChatDotIcon } from "./Chat/ChatDotIcon";
import { useDropdownSelection } from "./hooks/useDropdownSelection";
import { REMOTE_STOP_SCREENSHARE_TYPE } from "../common/constants";

/**
 * Taking peerID as peer won't necesarilly have tracks
 */
const TileMenu = ({
  audioTrackID,
  videoTrackID,
  peerID,
  isScreenshare = false,
}) => {
  const actions = useHMSActions();
  const { removeOthers } = useHMSStore(selectPermissions);
  const {
    isAudioEnabled,
    isVideoEnabled,
    setVolume,
    toggleAudio,
    toggleVideo,
    volume,
  } = useRemoteAVToggle(audioTrackID, videoTrackID);
  const { sendEvent } = useCustomEvent({
    type: REMOTE_STOP_SCREENSHARE_TYPE,
  });
  if (!(removeOthers || toggleAudio || toggleVideo || setVolume)) {
    return null;
  }
  return (
    <StyledMenuTile.Root>
      <StyledMenuTile.Trigger data-testid="participant_menu_btn">
        <HorizontalMenuIcon />
      </StyledMenuTile.Trigger>
      <StyledMenuTile.Content side="top" align="end" sideOffset={8}>
        {toggleVideo ? (
          <StyledMenuTile.ItemButton
            onClick={toggleVideo}
            data-testid={
              isVideoEnabled
                ? "mute_video_participant_btn"
                : "unmute_video_participant_btn"
            }
          >
            {isVideoEnabled ? <VideoOnIcon /> : <VideoOffIcon />}
            <span>{`${isVideoEnabled ? "Mute" : "Request Unmute"}`}</span>
          </StyledMenuTile.ItemButton>
        ) : null}
        {toggleAudio ? (
          <StyledMenuTile.ItemButton
            onClick={toggleAudio}
            data-testid={
              isVideoEnabled
                ? "mute_audio_participant_btn"
                : "unmute_audio_participant_btn"
            }
          >
            {isAudioEnabled ? <MicOnIcon /> : <MicOffIcon />}
            <span>{`${isAudioEnabled ? "Mute" : "Request Unmute"}`}</span>
          </StyledMenuTile.ItemButton>
        ) : null}
        {audioTrackID ? (
          <StyledMenuTile.VolumeItem data-testid="participant_volume_slider">
            <Flex align="center" gap={1}>
              <SpeakerIcon />
              <Box as="span" css={{ ml: "$4" }}>
                Volume ({volume})
              </Box>
            </Flex>
            <Slider
              css={{ my: "0.5rem" }}
              step={5}
              value={[volume]}
              onValueChange={e => setVolume(e[0])}
            />
          </StyledMenuTile.VolumeItem>
        ) : null}
        <SimulcastLayers trackId={videoTrackID} />
        {removeOthers ? (
          <StyledMenuTile.RemoveItem
            onClick={async () => {
              try {
                await actions.removePeer(peerID, "");
              } catch (error) {
                // TODO: Toast here
              }
            }}
            data-testid="remove_participant_btn"
          >
            <RemoveUserIcon />
            <span>Remove Participant</span>
          </StyledMenuTile.RemoveItem>
        ) : null}

        {removeOthers && isScreenshare ? (
          <StyledMenuTile.RemoveItem onClick={() => sendEvent({})}>
            <ShareScreenIcon />
            <span>Stop Screenshare</span>
          </StyledMenuTile.RemoveItem>
        ) : null}
      </StyledMenuTile.Content>
    </StyledMenuTile.Root>
  );
};

const SimulcastLayers = ({ trackId }) => {
  const track = useHMSStore(selectTrackByID(trackId));
  const actions = useHMSActions();
  const bg = useDropdownSelection();
  if (!track?.layerDefinitions || track.degraded || !track.enabled) {
    return null;
  }
  return (
    <Fragment>
      {track.layerDefinitions.map(layer => {
        return (
          <StyledMenuTile.ItemButton
            key={layer.layer}
            onClick={async () => {
              await actions.setPreferredLayer(trackId, layer.layer);
            }}
            css={{
              bg: track.expectedLayer === layer.layer ? bg : undefined,
            }}
          >
            <ChatDotIcon
              css={{
                visibility: layer.layer === track.layer ? "visible" : "hidden",
                mr: "$2",
              }}
            />
            <Text as="span" css={{ textTransform: "capitalize", mr: "$2" }}>
              {layer.layer}
            </Text>
            ({layer.resolution.width}x{layer.resolution.height})
          </StyledMenuTile.ItemButton>
        );
      })}
    </Fragment>
  );
};

export default TileMenu;
