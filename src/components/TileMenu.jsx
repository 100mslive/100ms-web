// @ts-check
import React from "react";
import {
  HorizontalMenuIcon,
  MicOffIcon,
  VideoOffIcon,
  VideoOnIcon,
  MicOnIcon,
  SpeakerIcon,
  RemoveUserIcon,
} from "@100mslive/react-icons";
import {
  useHMSStore,
  selectPermissions,
  useHMSActions,
  useRemoteAVToggle,
} from "@100mslive/react-sdk";
import { Flex, StyledMenuTile, Slider } from "@100mslive/react-ui";

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
  let { removeOthers } = useHMSStore(selectPermissions);
  removeOthers = removeOthers && !isScreenshare;
  const {
    isAudioEnabled,
    isVideoEnabled,
    setVolume,
    toggleAudio,
    toggleVideo,
    volume,
  } = useRemoteAVToggle(audioTrackID, videoTrackID);
  if (!(removeOthers || toggleAudio || toggleVideo || setVolume)) {
    return null;
  }
  return (
    <StyledMenuTile.Root>
      <StyledMenuTile.Trigger>
        <HorizontalMenuIcon />
      </StyledMenuTile.Trigger>
      <StyledMenuTile.Content side="left" align="start" sideOffset={10}>
        {toggleVideo ? (
          <StyledMenuTile.ItemButton onClick={toggleVideo}>
            {isVideoEnabled ? <VideoOnIcon /> : <VideoOffIcon />}
            <span>{`${isVideoEnabled ? "Mute" : "Request Unmute"}`}</span>
          </StyledMenuTile.ItemButton>
        ) : null}
        {toggleAudio ? (
          <StyledMenuTile.ItemButton onClick={toggleAudio}>
            {isAudioEnabled ? <MicOnIcon /> : <MicOffIcon />}
            <span>{`${isAudioEnabled ? "Mute" : "Request Unmute"}`}</span>
          </StyledMenuTile.ItemButton>
        ) : null}
        {audioTrackID ? (
          <StyledMenuTile.VolumeItem>
            <Flex align="center" gap={1}>
              <SpeakerIcon /> <span>Volume ({volume})</span>
            </Flex>
            <Slider
              css={{ my: "0.5rem" }}
              step={5}
              value={[volume]}
              onValueChange={e => setVolume(e[0])}
            />
          </StyledMenuTile.VolumeItem>
        ) : null}

        {removeOthers ? (
          <StyledMenuTile.RemoveItem
            onClick={async () => {
              try {
                await actions.removePeer(peerID, "");
              } catch (error) {
                // TODO: Toast here
              }
            }}
          >
            <RemoveUserIcon />
            <span>Remove Participant</span>
          </StyledMenuTile.RemoveItem>
        ) : null}
      </StyledMenuTile.Content>
    </StyledMenuTile.Root>
  );
};

export default TileMenu;
