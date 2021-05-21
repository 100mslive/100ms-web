export const HMSPeerToScreenStreamWitnInfo = (peer, speakers = []) => {
  if (!peer) return null;
  const hmsAudioTrack = peer.auxiliaryTracks.find(
    (track) => track.type === "audio"
  );
  const audioTrack = hmsAudioTrack && hmsAudioTrack.nativeTrack;
  const hmsVideoTrack = peer.auxiliaryTracks.find(
    (track) => track.type === "video" && track.source === "screen"
  );
  const videoTrack = hmsVideoTrack && hmsVideoTrack.nativeTrack;
  const peerSpeaker = speakers.find(
    (speaker) => speaker.peerId === peer.peerId
  );
  const isAudioMuted = !(audioTrack && audioTrack.enabled);

  return {
    videoTrack,
    hmsVideoTrack,
    audioTrack,
    peer: {
      id: peer.peerId,
      displayName: peer.name || peer.peerId,
    },
    videoSource: "screen",
    isLocal: peer.isLocal,
    isAudioMuted: isAudioMuted,
    isVideoMuted: !(videoTrack && videoTrack.enabled),
    audioLevel: !isAudioMuted && peerSpeaker && peerSpeaker.audioLevel,
  };
};

export const HMSPeertoCameraStreamWithInfo = (peer, speakers = []) => {
  if (!peer) return null;
  const peerSpeaker = speakers.find(
    (speaker) => speaker.peerId === peer.peerId
  );
  const isAudioMuted = !(peer.audioTrack && peer.audioTrack.enabled);
  return {
    videoTrack: peer.videoTrack ? peer.videoTrack.nativeTrack : undefined,
    hmsVideoTrack: peer.videoTrack,
    audioTrack: peer.audioTrack ? peer.audioTrack.nativeTrack : undefined,
    peer: {
      id: peer.peerId,
      displayName: peer.name || peer.peerId,
    },
    videoSource: "camera",
    isLocal: peer.isLocal,
    isAudioMuted: isAudioMuted,
    isVideoMuted: !(peer.videoTrack && peer.videoTrack.enabled),
    audioLevel: !isAudioMuted && peerSpeaker && peerSpeaker.audioLevel,
  };
};

export const getStreamsInfo = ({ peers, speakers = [] }) => {
  let streamsWithInfo = null;
  let screenStream = null;
  let cameraStream = null;

  if (!(peers && peers.length > 0 && peers[0])) {
    return { streamsWithInfo, screenStream, cameraStream };
  }

  const index = peers.findIndex(isScreenSharing);
  const screenSharingPeer = peers[index];
  let remPeers = [...peers];

  if (index !== -1) {
    remPeers.splice(index, 1);
    screenStream = HMSPeerToScreenStreamWitnInfo(screenSharingPeer, speakers);
    cameraStream = HMSPeertoCameraStreamWithInfo(screenSharingPeer, speakers);
  }

  const videoStreamsWithInfo = remPeers
    .filter((peer) => Boolean(peer.videoTrack || peer.audioTrack))
    .map((peer) => HMSPeertoCameraStreamWithInfo(peer, speakers));

  const screenShareStreamsWithInfo = remPeers
    .filter(isScreenSharing)
    .map((peer) => HMSPeerToScreenStreamWitnInfo(peer, speakers));

  streamsWithInfo = [...videoStreamsWithInfo, ...screenShareStreamsWithInfo];
  return { streamsWithInfo, screenStream, cameraStream };
};

export function shadeColor(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.floor((R * (100 + percent)) / 100);
  G = Math.floor((G * (100 + percent)) / 100);
  B = Math.floor((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR = R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}
