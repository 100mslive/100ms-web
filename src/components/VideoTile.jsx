import React, { Fragment, useCallback, useState } from "react";
import {
  Avatar,
  StyledVideoTile,
  Video,
  VideoTileStats,
  useBorderAudioLevel,
} from "@100mslive/react-ui";
import {
  useHMSStore,
  selectIsPeerAudioEnabled,
  selectPeerMetadata,
  selectLocalPeerID,
  selectPeerNameByID,
  selectAudioTrackByPeerID,
  selectTrackByID,
  selectVideoTrackByPeerID,
} from "@100mslive/react-sdk";
import {
  MicOffIcon,
  HandRaiseFilledIcon,
  BrbIcon,
} from "@100mslive/react-icons";
import TileMenu from "./TileMenu";
import { getVideoTileLabel } from "./peerTileUtils";
import TileConnection from "./Connection/TileConnection";
import { UI_SETTINGS } from "../common/constants";
import { useIsHeadless, useUISettings } from "./AppData/useUISettings";
import { useAppConfig } from "./AppData/useAppConfig";

const Tile = ({ peerId, trackId, showStatsOnTiles, width, height }) => {
  const trackSelector = trackId
    ? selectTrackByID(trackId)
    : selectVideoTrackByPeerID(peerId);
  const track = useHMSStore(trackSelector);
  const peerName = useHMSStore(selectPeerNameByID(peerId));
  const audioTrack = useHMSStore(selectAudioTrackByPeerID(peerId));
  const localPeerID = useHMSStore(selectLocalPeerID);
  const isAudioOnly = useUISettings(UI_SETTINGS.isAudioOnly);
  const isHeadless = useIsHeadless();
  const isAudioMuted = !useHMSStore(selectIsPeerAudioEnabled(peerId));
  const isVideoMuted = !track?.enabled;
  const [isMouseHovered, setIsMouseHovered] = useState(false);
  const borderAudioRef = useBorderAudioLevel(audioTrack?.id);
  const isVideoDegraded = track?.degraded;
  const isLocal = localPeerID === peerId;
  const label = getVideoTileLabel({
    peerName,
    track,
    isLocal,
  });
  const onHoverHandler = useCallback(event => {
    setIsMouseHovered(event.type === "mouseenter");
  }, []);
  const appConfig = useAppConfig();
  const hideLabel = isHeadless && appConfig?.headlessConfig?.hideTileName;
  return (
    <StyledVideoTile.Root
      css={{ width, height, padding: getPadding({ isHeadless, appConfig }) }}
      data-testid={`participant_tile_${peerName}`}
    >
      {peerName !== undefined ? (
        <StyledVideoTile.Container
          onMouseEnter={onHoverHandler}
          onMouseLeave={onHoverHandler}
          ref={
            isHeadless && appConfig?.headlessConfig?.hideAudioLevel
              ? undefined
              : borderAudioRef
          }
        >
          <TileConnection
            hideLabel={hideLabel}
            name={label}
            isTile
            peerId={peerId}
          />
          {showStatsOnTiles ? (
            <VideoTileStats
              audioTrackID={audioTrack?.id}
              videoTrackID={track?.id}
              peerID={peerId}
            />
          ) : null}

          {track ? (
            <Video
              trackId={track?.id}
              attach={isLocal ? undefined : !isAudioOnly}
              mirror={peerId === localPeerID && track?.source === "regular"}
              degraded={isVideoDegraded}
              data-testid="participant_video_tile"
            />
          ) : null}
          <StyledVideoTile.AvatarContainer>
            {isVideoMuted || isVideoDegraded || isAudioOnly ? (
              <Avatar
                name={peerName || ""}
                data-testid="participant_avatar_icon"
              />
            ) : null}
          </StyledVideoTile.AvatarContainer>

          {showAudioMuted({ appConfig, isHeadless, isAudioMuted }) ? (
            <StyledVideoTile.AudioIndicator data-testid="participant_audio_mute_icon">
              <MicOffIcon height={20} />
            </StyledVideoTile.AudioIndicator>
          ) : null}
          {isMouseHovered && !isHeadless && !isLocal ? (
            <TileMenu
              peerID={peerId}
              audioTrackID={audioTrack?.id}
              videoTrackID={track?.id}
            />
          ) : null}
          <PeerMetadata peerId={peerId} />
        </StyledVideoTile.Container>
      ) : null}
    </StyledVideoTile.Root>
  );
};

const metaStyles = { top: "$4", left: "$4" };

const PeerMetadata = ({ peerId }) => {
  const metaData = useHMSStore(selectPeerMetadata(peerId));
  const isHandRaised = metaData?.isHandRaised || false;
  const isBRB = metaData?.isBRBOn || false;

  return (
    <Fragment>
      {isHandRaised ? (
        <StyledVideoTile.AttributeBox
          css={metaStyles}
          data-testid="raiseHand_icon_onTile"
        >
          <HandRaiseFilledIcon width={40} height={40} />
        </StyledVideoTile.AttributeBox>
      ) : null}
      {isBRB ? (
        <StyledVideoTile.AttributeBox
          css={metaStyles}
          data-testid="brb_icon_onTile"
        >
          <BrbIcon width={40} height={40} />
        </StyledVideoTile.AttributeBox>
      ) : null}
    </Fragment>
  );
};

const VideoTile = React.memo(Tile);

const showAudioMuted = ({ appConfig, isHeadless, isAudioMuted }) => {
  if (!isHeadless) {
    return isAudioMuted;
  }
  const hide = appConfig?.headlessConfig?.hideTileAudioMute;
  return isAudioMuted && !hide;
};

const getPadding = ({ isHeadless, appConfig }) => {
  const offset = appConfig?.headlessConfig?.tileOffset;
  if (!isHeadless || typeof offset !== "number") {
    return undefined;
  }
  return offset === 0 ? 0 : undefined;
};

export default VideoTile;
