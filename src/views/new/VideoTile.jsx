// @ts-check
import React, { useState } from "react";
import {
  AudioLevel,
  Avatar,
  StyledVideoTile,
  TileMenu,
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
  selectIsAudioLocallyMuted,
} from "@100mslive/react-sdk";
import {
  MicOffIcon,
  HandRaiseFilledIcon,
  BrbIcon,
} from "@100mslive/react-icons";

const HmsVideoTile = ({ peerId, showStatsOnTiles, width, height }) => {
  const peer = useHMSStore(selectPeerByID(peerId));
  const isAudioMuted = !useHMSStore(selectIsPeerAudioEnabled(peerId));
  const isVideoMuted = !useHMSStore(selectIsPeerVideoEnabled(peerId));
  const [showTrigger, setShowTrigger] = useState(false);
  const isHandRaised =
    useHMSStore(selectPeerMetadata(peerId))?.isHandRaised || false;
  const isBRB = useHMSStore(selectPeerMetadata(peerId))?.isBRBOn || false;
  const videoTrack = useHMSStore(selectVideoTrackByPeerID(peer.id));
  const isLocallyMuted = useHMSStore(
    selectIsAudioLocallyMuted(peer.audioTrack)
  );
  const label = getVideoTileLabel(
    peer.name,
    peer.isLocal,
    videoTrack?.source,
    isLocallyMuted,
    videoTrack?.degraded
  );
  return (
    <StyledVideoTile.Root
      css={{ width, height }}
      onMouseEnter={() => setShowTrigger(true)}
      onMouseLeave={() => {
        setShowTrigger(false);
      }}
    >
      <StyledVideoTile.Container>
        {showStatsOnTiles ? (
          <VideoTileStats
            height={height}
            audioTrackID={peer?.audioTrack}
            videoTrackID={peer?.videoTrack}
          />
        ) : null}
        <AudioLevel audioTrack={peer?.audioTrack} />
        <Video mirror={peer?.isLocal || false} trackId={peer?.videoTrack} />
        {isVideoMuted ? (
          <Avatar size={getAvatarSize(height)} name={peer?.name || ""} />
        ) : null}
        <StyledVideoTile.Info>{label}</StyledVideoTile.Info>
        {isAudioMuted ? (
          <StyledVideoTile.AudioIndicator>
            <MicOffIcon />
          </StyledVideoTile.AudioIndicator>
        ) : null}
        {showTrigger && !peer?.isLocal ? <TileMenu peerId={peerId} /> : null}

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
    </StyledVideoTile.Root>
  );
};

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

const PEER_NAME_PLACEHOLDER = "peerName";
const labelMap = new Map([
  [[true, "screen"].toString(), "Your Screen"],
  [[true, "playlist"].toString(), "Your Playlist"],
  [[true, "regular"].toString(), `You (${PEER_NAME_PLACEHOLDER})`],
  [[false, "screen"].toString(), `${PEER_NAME_PLACEHOLDER}'s Screen`],
  [[false, "playlist"].toString(), `${PEER_NAME_PLACEHOLDER}'s Video`],
  [[false, "regular"].toString(), PEER_NAME_PLACEHOLDER],
  [[false, undefined].toString(), PEER_NAME_PLACEHOLDER],
]);

export const getVideoTileLabel = (
  peerName,
  isLocal,
  videoSource = "regular",
  isLocallyMuted,
  degraded
) => {
  // Map [isLocal, videoSource] to the label to be displayed.

  let label = labelMap
    .get([isLocal, videoSource].toString())
    .replace(PEER_NAME_PLACEHOLDER, peerName);
  label = `${label}${degraded ? "(Degraded)" : ""}`;
  if (
    (isLocallyMuted === undefined || isLocallyMuted === null) &&
    videoSource === "regular"
  ) {
    return label;
  }
  return `${label}${isLocallyMuted ? " (Muted for you)" : ""}`;
};
