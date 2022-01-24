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

const HmsVideoTile = ({ peerId, width, height, showStatsOnTiles }) => {
  const peer = useHMSStore(selectPeerByID(peerId));
  const isAudioMuted = !useHMSStore(selectIsPeerAudioEnabled(peerId));
  const isVideoMuted = !useHMSStore(selectIsPeerVideoEnabled(peerId));
  const [showTrigger, setShowTrigger] = useState(false);
  const isHandRaised =
    useHMSStore(selectPeerMetadata(peerId))?.isHandRaised || false;
  const isBRB = useHMSStore(selectPeerMetadata(peerId))?.isBRBOn || false;
  const storeHmsVideoTrack = useHMSStore(selectVideoTrackByPeerID(peer.id));
  const storeIsLocallyMuted = useHMSStore(
    selectIsAudioLocallyMuted(peer.audioTrack)
  );
  const label = getVideoTileLabel(
    peer.name,
    peer.isLocal,
    storeHmsVideoTrack?.source,
    storeIsLocallyMuted,
    storeHmsVideoTrack?.degraded
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
        <Video isLocal={peer?.isLocal || false} trackId={peer?.videoTrack} />
        {isVideoMuted ? (
          <Avatar size={getAvatarSize(width)} name={peer?.name || ""} />
        ) : null}
        <StyledVideoTile.Info>{label}</StyledVideoTile.Info>
        {isAudioMuted ? (
          <StyledVideoTile.AudioIndicator>
            <MicOffIcon />
          </StyledVideoTile.AudioIndicator>
        ) : null}
        {showTrigger && !peer?.isLocal ? <TileMenu peerId={peerId} /> : null}

        {isHandRaised ? (
          <StyledVideoTile.HandRaiseBox>
            <HandRaiseFilledIcon width={40} height={40} />
          </StyledVideoTile.HandRaiseBox>
        ) : null}
        {isBRB ? (
          <StyledVideoTile.HandRaiseBox css={{ c: "white" }}>
            <BrbIcon width={40} height={40} />
          </StyledVideoTile.HandRaiseBox>
        ) : null}
      </StyledVideoTile.Container>
    </StyledVideoTile.Root>
  );
};

export default HmsVideoTile;

const getAvatarSize = width => {
  if (width < 200) {
    return "xs";
  } else if (width < 500) {
    return "sm";
  } else {
    return "md";
  }
};

export const getVideoTileLabel = (
  peerName,
  isLocal,
  videoSource = "regular",
  isLocallyMuted,
  degraded
) => {
  // Map [isLocal, videoSource] to the label to be displayed.
  const labelMap = new Map([
    [[true, "screen"].toString(), "Your Screen"],
    [[true, "playlist"].toString(), "Your Video"],
    [[true, "regular"].toString(), `You (${peerName})`],
    [[false, "screen"].toString(), `${peerName}'s Screen`],
    [[false, "playlist"].toString(), `${peerName}'s Video`],
    [[false, "regular"].toString(), peerName],
    [[false, undefined].toString(), peerName],
  ]);

  let label = labelMap.get([isLocal, videoSource].toString());
  label = `${label}${degraded ? "(Degraded)" : ""}`;
  if (
    (isLocallyMuted === undefined || isLocallyMuted === null) &&
    videoSource === "regular"
  ) {
    return label;
  }
  return `${label}${isLocallyMuted ? " (Muted for you)" : ""}`;
};
