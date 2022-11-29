import React, { Fragment } from "react";
import {
  selectLocalPeerID,
  selectPermissions,
  selectTrackByID,
  selectVideoTrackByPeerID,
  useCustomEvent,
  useHMSActions,
  useHMSStore,
  useRemoteAVToggle,
} from "@100mslive/react-sdk";
import {
  HorizontalMenuIcon,
  MicOffIcon,
  MicOnIcon,
  PinIcon,
  RemoveUserIcon,
  ShareScreenIcon,
  SpeakerIcon,
  VideoOffIcon,
  VideoOnIcon,
} from "@100mslive/react-icons";
import { Box, Flex, Slider, StyledMenuTile, Text } from "@100mslive/react-ui";
import { useSetAppDataByKey } from "./AppData/useUISettings";
import { useDropdownSelection } from "./hooks/useDropdownSelection";
import { APP_DATA, REMOTE_STOP_SCREENSHARE_TYPE } from "../common/constants";

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
  const localPeerID = useHMSStore(selectLocalPeerID);
  const isLocal = localPeerID === peerID;
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
  const [pinnedTrackId, setPinnedTrackId] = useSetAppDataByKey(
    APP_DATA.pinnedTrackId
  );
  const isTilePinned =
    pinnedTrackId &&
    ((videoTrackID && videoTrackID === pinnedTrackId) ||
      (audioTrackID && audioTrackID === pinnedTrackId));
  const isPrimaryVideoTrack =
    useHMSStore(selectVideoTrackByPeerID(peerID))?.id === videoTrackID;

  const showPinAction = audioTrackID || (videoTrackID && isPrimaryVideoTrack);

  const track = useHMSStore(selectTrackByID(videoTrackID));
  const hideSimulcastLayers =
    !track?.layerDefinitions?.length || track.degraded || !track.enabled;
  if (
    !(
      removeOthers ||
      toggleAudio ||
      toggleVideo ||
      setVolume ||
      showPinAction
    ) &&
    hideSimulcastLayers
  ) {
    return null;
  }

  return (
    <StyledMenuTile.Root>
      <StyledMenuTile.Trigger data-testid="participant_menu_btn">
        <HorizontalMenuIcon />
      </StyledMenuTile.Trigger>
      <StyledMenuTile.Content side="top" align="end">
        {isLocal && showPinAction ? (
          <StyledMenuTile.ItemButton
            onClick={() =>
              isTilePinned
                ? setPinnedTrackId()
                : setPinnedTrackId(videoTrackID || audioTrackID)
            }
          >
            <PinIcon />
            <span>{`${isTilePinned ? "Unpin" : "Pin"}`} Tile</span>
          </StyledMenuTile.ItemButton>
        ) : (
          <>
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
            {showPinAction && (
              <StyledMenuTile.ItemButton
                onClick={() =>
                  isTilePinned
                    ? setPinnedTrackId()
                    : setPinnedTrackId(videoTrackID || audioTrackID)
                }
              >
                <PinIcon />
                <span>{`${isTilePinned ? "Unpin" : "Pin"}`} Tile</span>
              </StyledMenuTile.ItemButton>
            )}
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
          </>
        )}
      </StyledMenuTile.Content>
    </StyledMenuTile.Root>
  );
};

const SimulcastLayers = ({ trackId }) => {
  const track = useHMSStore(selectTrackByID(trackId));
  const actions = useHMSActions();
  const bg = useDropdownSelection();
  if (!track?.layerDefinitions?.length || track.degraded || !track.enabled) {
    return null;
  }
  const currentLayer = track.layerDefinitions.find(
    layer => layer.layer === track.layer
  );
  return (
    <Fragment>
      <StyledMenuTile.ItemButton
        css={{ color: "$textMedEmp", cursor: "default" }}
      >
        Select maximum resolution
      </StyledMenuTile.ItemButton>
      {track.layerDefinitions.map(layer => {
        return (
          <StyledMenuTile.ItemButton
            key={layer.layer}
            onClick={async () => {
              await actions.setPreferredLayer(trackId, layer.layer);
            }}
            css={{
              justifyContent: "space-between",
              bg: track.preferredLayer === layer.layer ? bg : undefined,
              "&:hover": {
                bg: track.preferredLayer === layer.layer ? bg : undefined,
              },
            }}
          >
            <Text
              as="span"
              css={{
                textTransform: "capitalize",
                mr: "$2",
                fontWeight:
                  track.preferredLayer === layer.layer
                    ? "$semiBold"
                    : "$regular",
              }}
            >
              {layer.layer}
            </Text>
            <Text as="span" variant="xs" css={{ color: "$textMedEmp" }}>
              {layer.resolution.width}x{layer.resolution.height}
            </Text>
          </StyledMenuTile.ItemButton>
        );
      })}
      {currentLayer && (
        <StyledMenuTile.ItemButton>
          <Text as="span" variant="xs" css={{ color: "$textMedEmp" }}>
            Currently streaming:
            <Text
              as="span"
              variant="xs"
              css={{
                fontWeight: "$semiBold",
                textTransform: "capitalize",
                color: "$textMedEmp",
                ml: "$2",
              }}
            >
              {track.layer} ({currentLayer.resolution.width}x
              {currentLayer.resolution.height})
            </Text>
          </Text>
        </StyledMenuTile.ItemButton>
      )}
    </Fragment>
  );
};

export default TileMenu;
