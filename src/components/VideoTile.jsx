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
  selectIsPeerVideoEnabled,
  selectPeerMetadata,
  selectVideoTrackByPeerID,
  selectLocalPeerID,
  selectPeerNameByID,
  selectAudioTrackByPeerID,
} from "@100mslive/react-sdk";
import {
  MicOffIcon,
  HandRaiseFilledIcon,
  BrbIcon,
} from "@100mslive/react-icons";
import TileMenu from "./TileMenu";
import { getVideoTileLabel } from "./peerTileUtils";
import { ConnectionIndicator } from "./Connection/ConnectionIndicator";
import { UI_SETTINGS } from "../common/constants";
import { useUISettings } from "./AppData/useUISettings";

const Tile = ({ peerId, showStatsOnTiles, width, height, index }) => {
  const track = useHMSStore(selectVideoTrackByPeerID(peerId));
  const peerName = useHMSStore(selectPeerNameByID(peerId));
  const audioTrack = useHMSStore(selectAudioTrackByPeerID(peerId));
  const localPeerID = useHMSStore(selectLocalPeerID);
  const isAudioOnly = useUISettings(UI_SETTINGS.isAudioOnly);
  const isAudioMuted = !useHMSStore(selectIsPeerAudioEnabled(peerId));
  const isVideoMuted = !useHMSStore(selectIsPeerVideoEnabled(peerId));
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
  return (
    <StyledVideoTile.Root
      css={{ width, height }}
      data-testid={`participant_tile_${index}`}
    >
      {peerName ? (
        <StyledVideoTile.Container
          onMouseEnter={onHoverHandler}
          onMouseLeave={onHoverHandler}
          ref={borderAudioRef}
        >
          <ConnectionIndicator isTile peerId={peerId} />
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
              attach={!isAudioOnly}
              mirror={peerId === localPeerID && track?.source === "regular"}
              degraded={isVideoDegraded}
              data-testid="participant_video_tile"
            />
          ) : null}
          {isVideoMuted || isVideoDegraded || isAudioOnly ? (
            <Avatar
              name={peerName || ""}
              data-testid="participant_avatar_icon"
            />
          ) : null}
          <StyledVideoTile.Info data-testid="participant_name_onTile">
            {label}
          </StyledVideoTile.Info>
          {isAudioMuted ? (
            <StyledVideoTile.AudioIndicator data-testid="participant_audio_mute_icon">
              <MicOffIcon />
            </StyledVideoTile.AudioIndicator>
          ) : null}
          {isMouseHovered && !isLocal ? (
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

const metaStyles = { left: "20px", bottom: "20px" };

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

export default VideoTile;
