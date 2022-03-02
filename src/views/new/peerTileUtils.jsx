const PEER_NAME_PLACEHOLDER = "peerName";
const labelMap = new Map([
  [[true, "screen"].toString(), "Your Screen"],
  [[true, "regular"].toString(), `You (${PEER_NAME_PLACEHOLDER})`],
  [[false, "screen"].toString(), `${PEER_NAME_PLACEHOLDER}'s Screen`],
  [[false, "regular"].toString(), PEER_NAME_PLACEHOLDER],
  [[true, undefined].toString(), `You (${PEER_NAME_PLACEHOLDER})`],
  [[false, undefined].toString(), `${PEER_NAME_PLACEHOLDER}`],
]);

export const getVideoTileLabel = (peer, track) => {
  if (!peer || !track) {
    // for peers with only audio track
    return peer
      ? labelMap
          .get([peer.isLocal, undefined].toString())
          .replace(PEER_NAME_PLACEHOLDER, peer.name)
      : "";
  }
  const isLocallyMuted = track.volume === 0;
  // Map [isLocal, videoSource] to the label to be displayed.
  let label = labelMap.get([peer.isLocal, track.source].toString());
  if (label) {
    label = label.replace(PEER_NAME_PLACEHOLDER, peer.name);
  } else {
    label = `${peer.name} ${track.source}`;
  }
  label = `${label}${track.degraded ? "(Degraded)" : ""}`;
  return `${label}${isLocallyMuted ? " (Muted for you)" : ""}`;
};
