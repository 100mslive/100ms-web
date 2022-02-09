// @ts-check
import React, { useRef, useState } from "react";
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
  selectTrackByID,
} from "@100mslive/react-sdk";
import {
  MicOffIcon,
  HandRaiseFilledIcon,
  BrbIcon,
} from "@100mslive/react-icons";
import { HmsTileMenu } from "../UIComponents";
import { getVideoTileLabel } from "./peerTileUtils";

const VideoTile = ({ trackId, showStatsOnTiles, width, height }) => {
  const track = useHMSStore(selectTrackByID(trackId));
  const peer = useHMSStore(selectPeerByID(track?.peerId));
  const isAudioMuted = !useHMSStore(selectIsPeerAudioEnabled(track?.peerId));
  const isVideoMuted = !useHMSStore(selectIsPeerVideoEnabled(track?.peerId));
  const [isMouseHovered, setIsMouseHovered] = useState(false);
  const metaData = useHMSStore(selectPeerMetadata(track?.peerId));
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
              mirror={peer.isLocal && track?.source === "regular"}
              trackId={track.id}
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
            <HmsTileMenu
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

const HmsVideoTile = React.memo(VideoTile);

export default HmsVideoTile;

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
