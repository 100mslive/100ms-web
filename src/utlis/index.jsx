export default async function getToken(username, role, roomId) {
  const response = await fetch("https://100ms-services.vercel.app/api/token", {
    method: "POST",
    body: JSON.stringify({
      env: "qa-in",
      role: role,
      room_id: roomId,
      //room_id: "6077d5e1dcee704ca43caea3",
      user_name: username,
    }),
  });

  const { token } = await response.json();

  return token;
}

export const HMSPeerToScreenStreamWitnInfo = (peer) => {
  if (!peer) return null;
  console.debug(
    "app: Screenshare video track",
    peer.auxiliaryTracks.find((track) => track.nativeTrack.kind === "video")
  );
  console.debug(
    "app: Screenshare audio track",
    peer.auxiliaryTracks.find((track) => track.nativeTrack.kind === "audio")
  );
  return {
    videoTrack: peer.auxiliaryTracks.find(
      (track) => track.nativeTrack.kind === "video"
    )
      ? peer.auxiliaryTracks.find((track) => track.nativeTrack.kind === "video")
          .nativeTrack
      : undefined,
    audioTrack: peer.auxiliaryTracks.find(
      (track) => track.nativeTrack.kind === "audio"
    )
      ? peer.auxiliaryTracks.find((track) => track.nativeTrack.kind === "audio")
          .nativeTrack
      : undefined,
    peer: {
      id: peer.peerId,
      displayName: peer.name || peer.peerId,
    },
    videoSource: "screen",
    audioLevel: 0,
    isLocal: peer.isLocal,
  };
};
export const HMSPeertoCamerStreamWithInfo = (peer) => {
  if (!peer) return null;
  console.debug("app: Camera video track", peer.videoTrack);
  console.debug("app: Camera audio track", peer.audioTrack);
  return {
    videoTrack: peer.videoTrack ? peer.videoTrack.nativeTrack : undefined,
    audioTrack: peer.audioTrack ? peer.audioTrack.nativeTrack : undefined,
    peer: {
      id: peer.peerId,
      displayName: peer.name || peer.peerId,
    },
    videoSource: "camera",
    audioLevel: 0,
    isLocal: peer.isLocal,
  };
};

export const isScreenSharing = (peer) =>
  peer &&
  Boolean(peer.auxiliaryTracks) &&
  Boolean(peer.auxiliaryTracks.length > 0) &&
  (Boolean(
    peer.auxiliaryTracks.find(
      (track) =>
        track.nativeTrack.kind === "audio"
    )
  ) ||
    Boolean(
      peer.auxiliaryTracks.find(
        (track) =>
          track.nativeTrack.kind === "video" &&
          track.source == "screen"
      )
    ));
