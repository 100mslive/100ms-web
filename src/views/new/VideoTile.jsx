// @ts-check
import React, { useState } from "react";
import {
  AudioLevel,
  Avatar,
  StyledVideoTile,
  Video,
  VideoTileStats,
} from "@100mslive/react-ui";
import {
  useHMSStore,
  selectIsPeerAudioEnabled,
  selectIsPeerVideoEnabled,
  selectPeerByID,
  selectPeerMetadata,
  selectVideoTrackByPeerID,
} from "@100mslive/react-sdk";
import {
  MicOffIcon,
  HandRaiseFilledIcon,
  BrbIcon,
} from "@100mslive/react-icons";
import TileMenu from "./TileMenu";
import { getVideoTileLabel } from "./peerTileUtils";

const Tile = ({ peerId, showStatsOnTiles, width, height }) => {
  const track = useHMSStore(selectVideoTrackByPeerID(peerId));
  const peer = useHMSStore(selectPeerByID(peerId));
  const isAudioMuted = !useHMSStore(selectIsPeerAudioEnabled(peerId));
  const isVideoMuted = !useHMSStore(selectIsPeerVideoEnabled(peerId));
  const [isMouseHovered, setIsMouseHovered] = useState(false);
  const metaData = useHMSStore(selectPeerMetadata(peerId));
  const isHandRaised = metaData?.isHandRaised || false;
  const isBRB = metaData?.isBRBOn || false;
  const label = getVideoTileLabel(peer, track);
  return (
    <StyledVideoTile.Root css={{ width, height }}>
      {peer ? (
        <StyledVideoTile.Container
          onMouseEnter={() => setIsMouseHovered(true)}
          onMouseLeave={() => {
            setIsMouseHovered(false);
          }}
        >
          {showStatsOnTiles ? (
            <VideoTileStats
              audioTrackID={peer?.audioTrack}
              videoTrackID={peer?.videoTrack}
            />
          ) : null}

          <AudioLevel audioTrack={peer?.audioTrack} />
          {track ? (
            <Video
              mirror={peer?.isLocal && track?.source === "regular"}
              trackId={track?.id}
            />
          ) : null}
          {isVideoMuted ? (
            <Avatar size={getAvatarSize(height)} name={peer?.name || ""} />
          ) : null}
          <StyledVideoTile.Info>{label}</StyledVideoTile.Info>
          {isAudioMuted ? (
            <StyledVideoTile.AudioIndicator>
              <MicOffIcon />
            </StyledVideoTile.AudioIndicator>
          ) : null}
          {isMouseHovered && !peer?.isLocal ? (
            <TileMenu
              peerID={peer?.id}
              audioTrackID={peer?.audioTrack}
              videoTrackID={peer?.videoTrack}
            />
          ) : null}
          {isHandRaised ? (
            <StyledVideoTile.AttributeBox>
              <HandRaiseFilledIcon width={40} height={40} />
            </StyledVideoTile.AttributeBox>
          ) : null}
          {isBRB ? (
            <StyledVideoTile.AttributeBox>
              <BrbIcon width={40} height={40} />
            </StyledVideoTile.AttributeBox>
          ) : null}
        </StyledVideoTile.Container>
      ) : null}
    </StyledVideoTile.Root>
  );
};

const VideoTile = React.memo(Tile);

export default VideoTile;

const getAvatarSize = height => {
  if (height === "100%") {
    return "sm";
  }
  if (height < 200) {
    return "xs";
  } else if (height < 500) {
    return "sm";
  } else {
    return "md";
  }
};
