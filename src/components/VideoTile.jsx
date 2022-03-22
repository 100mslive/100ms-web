// @ts-check
import React from "react";
import {
  Avatar,
  StyledVideoTile,
  Video,
  VideoTileStats,
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

  const isVideoDegraded = track?.degraded;
  const isHandRaised = metaData?.isHandRaised || false;
  const isBRB = metaData?.isBRBOn || false;
  return (
    <StyledVideoTile.Root css={{ width, height }}>
      {peer ? (
        <StyledVideoTile.Container>
          {showStatsOnTiles ? (
            <VideoTileStats
              audioTrackID={peer?.audioTrack}
              videoTrackID={peer?.videoTrack}
              peerID={peer?.id}
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
            <StyledVideoTile.AttributeBox css={metaStyles}>
              <HandRaiseFilledIcon width={40} height={40} />
            </StyledVideoTile.AttributeBox>
          ) : null}
          {isBRB ? (
            <StyledVideoTile.AttributeBox css={metaStyles}>
              <BrbIcon width={40} height={40} />
            </StyledVideoTile.AttributeBox>
          ) : null}
        </StyledVideoTile.Container>
      ) : null}
    </StyledVideoTile.Root>
  );
};

const metaStyles = { left: "20px", bottom: "20px" };

const VideoTile = React.memo(Tile);

export default VideoTile;
