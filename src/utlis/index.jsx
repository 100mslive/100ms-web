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

export const HMSPeerToScreenStreamWitnInfo = (peer, speakers) => {
  if (!peer) return null;
  const audioTrack = peer.auxiliaryTracks.find(
    (track) => track.nativeTrack.kind === "audio"
  )
    ? peer.auxiliaryTracks.find((track) => track.nativeTrack.kind === "audio")
        .nativeTrack
    : undefined;
  const videoTrack = peer.auxiliaryTracks.find(
    (track) => track.nativeTrack.kind === "video"
  )
    ? peer.auxiliaryTracks.find((track) => track.nativeTrack.kind === "video")
        .nativeTrack
    : undefined;
  const peerSpeaker = speakers.find(
    (speaker) => speaker.peerId === peer.peerId
  );
  const isAudioMuted = !(audioTrack && audioTrack.enabled);

  return {
    videoTrack,
    audioTrack,
    peer: {
      id: peer.peerId,
      displayName: peer.name || peer.peerId,
    },
    videoSource: "screen",
    audioLevel: 0,
    isLocal: peer.isLocal,
    isAudioMuted: isAudioMuted,
    isVideoMuted: !(videoTrack && videoTrack.enabled),
    audioLevel: !isAudioMuted && peerSpeaker && peerSpeaker.audioLevel,
  };
};
export const HMSPeertoCameraStreamWithInfo = (peer, speakers) => {
  if (!peer) return null;
  const peerSpeaker = speakers.find(
    (speaker) => speaker.peerId === peer.peerId
  );
  const isAudioMuted = !(peer.audioTrack && peer.audioTrack.enabled);
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
    isAudioMuted: isAudioMuted,
    isVideoMuted: !(peer.videoTrack && peer.videoTrack.enabled),
    audioLevel: !isAudioMuted && peerSpeaker && peerSpeaker.audioLevel,
  };
};

export const isScreenSharing = (peer) =>
  peer &&
  Boolean(peer.auxiliaryTracks) &&
  Boolean(peer.auxiliaryTracks.length > 0) &&
  (Boolean(
    peer.auxiliaryTracks.find((track) => track.nativeTrack.kind === "audio")
  ) ||
    Boolean(
      peer.auxiliaryTracks.find(
        (track) =>
          track.nativeTrack.kind === "video" && track.source === "screen"
      )
    ));
