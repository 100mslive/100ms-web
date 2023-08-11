import React, { Fragment, useState } from "react";
import {
  selectLocalPeerID,
  selectPermissions,
  selectSessionStore,
  selectTemplateAppData,
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
  StarIcon,
  VideoOffIcon,
  VideoOnIcon,
} from "@100mslive/react-icons";
import {
  Box,
  Flex,
  Slider,
  StyledMenuTile,
  Text,
} from "@100mslive/roomkit-react";
import { ToastManager } from "./Toast/ToastManager";
import { useSetAppDataByKey } from "./AppData/useUISettings";
import { useDropdownList } from "./hooks/useDropdownList";
import { useDropdownSelection } from "./hooks/useDropdownSelection";
import { useIsFeatureEnabled } from "./hooks/useFeatures";
import {
  APP_DATA,
  FEATURE_LIST,
  REMOTE_STOP_SCREENSHARE_TYPE,
  SESSION_STORE_KEY,
} from "../common/constants";

const isSameTile = ({ trackId, videoTrackID, audioTrackID }) =>
  trackId &&
  ((videoTrackID && videoTrackID === trackId) ||
    (audioTrackID && audioTrackID === trackId));

const SpotlightActions = ({ peerId }) => {
  const hmsActions = useHMSActions();
  const spotlightPeerId = useHMSStore(
    selectSessionStore(SESSION_STORE_KEY.SPOTLIGHT)
  );
  const isTileSpotlighted = spotlightPeerId === peerId;

  const setSpotlightPeerId = peer =>
    hmsActions.sessionStore
      .set(SESSION_STORE_KEY.SPOTLIGHT, peer)
      .catch(err => ToastManager.addToast({ title: err.description }));

  return (
    <StyledMenuTile.ItemButton
      onClick={() =>
        isTileSpotlighted ? setSpotlightPeerId() : setSpotlightPeerId(peerId)
      }
    >
      <StarIcon />
      <span>
        {isTileSpotlighted
          ? "Remove from Spotlight"
          : "Spotlight Tile for everyone"}
      </span>
    </StyledMenuTile.ItemButton>
  );
};

const PinActions = ({ audioTrackID, videoTrackID }) => {
  const [pinnedTrackId, setPinnedTrackId] = useSetAppDataByKey(
    APP_DATA.pinnedTrackId
  );

  const isTilePinned = isSameTile({
    trackId: pinnedTrackId,
    videoTrackID,
    audioTrackID,
  });

  return (
    <>
      <StyledMenuTile.ItemButton
        onClick={() =>
          isTilePinned
            ? setPinnedTrackId()
            : setPinnedTrackId(videoTrackID || audioTrackID)
        }
      >
        <PinIcon />
        <span>{isTilePinned ? "Unpin" : "Pin"} Tile for myself</span>
      </StyledMenuTile.ItemButton>
    </>
  );
};

/**
 * Taking peerID as peer won't necesarilly have tracks
 */
const TileMenu = ({
  audioTrackID,
  videoTrackID,
  peerID,
  isScreenshare = false,
}) => {
  const [open, setOpen] = useState(false);
  const actions = useHMSActions();
  const localPeerID = useHMSStore(selectLocalPeerID);
  const isLocal = localPeerID === peerID;
  const { removeOthers, changeRole } = useHMSStore(selectPermissions);
  const showSpotlight = changeRole;

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

  const isPrimaryVideoTrack =
    useHMSStore(selectVideoTrackByPeerID(peerID))?.id === videoTrackID;
  const uiMode = useHMSStore(selectTemplateAppData).uiMode;
  const isInset = uiMode === "inset";

  const isPinEnabled = useIsFeatureEnabled(FEATURE_LIST.PIN_TILE);
  const showPinAction =
    isPinEnabled &&
    (audioTrackID || (videoTrackID && isPrimaryVideoTrack)) &&
    !isInset;

  const track = useHMSStore(selectTrackByID(videoTrackID));
  const hideSimulcastLayers =
    !track?.layerDefinitions?.length || track.degraded || !track.enabled;

  useDropdownList({ open, name: "TileMenu" });

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

  if (isInset && isLocal) {
    return null;
  }

  return (
    <StyledMenuTile.Root open={open} onOpenChange={setOpen}>
      <StyledMenuTile.Trigger
        data-testid="participant_menu_btn"
        onClick={e => e.stopPropagation()}
      >
        <HorizontalMenuIcon />
      </StyledMenuTile.Trigger>
      <StyledMenuTile.Content side="top" align="end">
        {isLocal ? (
          showPinAction && (
            <>
              <PinActions
                audioTrackID={audioTrackID}
                videoTrackID={videoTrackID}
              />
              {showSpotlight && <SpotlightActions peerId={peerID} />}
            </>
          )
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
                <span>{isVideoEnabled ? "Mute" : "Request Unmute"}</span>
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
                <span>{isAudioEnabled ? "Mute" : "Request Unmute"}</span>
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
              <>
                <PinActions
                  audioTrackID={audioTrackID}
                  videoTrackID={videoTrackID}
                />
                {showSpotlight && <SpotlightActions peerId={peerID} />}
              </>
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
        css={{ color: "$on_surface_medium", cursor: "default" }}
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
            <Text as="span" variant="xs" css={{ color: "$on_surface_medium" }}>
              {layer.resolution.width}x{layer.resolution.height}
            </Text>
          </StyledMenuTile.ItemButton>
        );
      })}
      <StyledMenuTile.ItemButton>
        <Text as="span" variant="xs" css={{ color: "$on_surface_medium" }}>
          Currently streaming:
          <Text
            as="span"
            variant="xs"
            css={{
              fontWeight: "$semiBold",
              textTransform: "capitalize",
              color: "$on_surface_medium",
              ml: "$2",
            }}
          >
            {currentLayer ? (
              <>
                {track.layer} ({currentLayer.resolution.width}x
                {currentLayer.resolution.height})
              </>
            ) : (
              "-"
            )}
          </Text>
        </Text>
      </StyledMenuTile.ItemButton>
    </Fragment>
  );
};

export default TileMenu;
