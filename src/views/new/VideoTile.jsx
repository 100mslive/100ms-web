// @ts-check
import React from "react";
import {
  Avatar,
  StyledVideoTile,
  Video,
  VideoTileStats,
  useBorderAudioLevel,
} from "@100mslive/react-ui";
import {
  useHMSStore,
  selectIsPeerVideoEnabled,
  selectPeerByID,
  selectPeerMetadata,
  selectVideoTrackByPeerID,
} from "@100mslive/react-sdk";
import { HandRaiseFilledIcon, BrbIcon } from "@100mslive/react-icons";

const Tile = ({ peerId, showStatsOnTiles, width, height }) => {
  const track = useHMSStore(selectVideoTrackByPeerID(peerId));
  const peer = useHMSStore(selectPeerByID(peerId));
  const isVideoMuted = !useHMSStore(selectIsPeerVideoEnabled(peerId));
  const metaData = useHMSStore(selectPeerMetadata(peerId));
  const borderAudioRef = useBorderAudioLevel(peer?.audioTrack);
  const isVideoDegraded = track?.degraded;
  const isHandRaised = metaData?.isHandRaised || false;
  const isBRB = metaData?.isBRBOn || false;
  return (
    <StyledVideoTile.Root css={{ width, height }}>
      {peer ? (
        <StyledVideoTile.Container
          onMouseEnter={() => setIsMouseHovered(true)}
          onMouseLeave={() => {
            setIsMouseHovered(false);
          }}
          ref={borderAudioRef}
        >
          {showStatsOnTiles ? (
            <VideoTileStats
              audioTrackID={peer?.audioTrack}
              videoTrackID={peer?.videoTrack}
            />
          ) : null}

          {track ? (
            <Video
              trackId={track?.id}
              mirror={peer?.isLocal && track?.source === "regular"}
              degraded={isVideoDegraded}
            />
          ) : null}
          {isVideoMuted || isVideoDegraded ? (
            <Avatar name={peer?.name || ""} />
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
