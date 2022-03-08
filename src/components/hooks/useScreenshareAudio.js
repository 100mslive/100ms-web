import { useCallback } from "react";
import {
  selectPeerSharingAudio,
  selectScreenShareAudioByPeerID,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";

export const useScreenshareAudio = () => {
  const hmsActions = useHMSActions();
  const peer = useHMSStore(selectPeerSharingAudio);
  const track = useHMSStore(selectScreenShareAudioByPeerID(peer?.id));

  const handleMute = useCallback(() => {
    if (!peer.isLocal) {
      hmsActions.setVolume(!track.volume ? 100 : 0, track.id);
    } else {
      hmsActions.setEnabledTrack(track.id, !track.enabled).catch(console.error);
    }
  }, [peer, hmsActions, track]);

  let muted = undefined;
  if (peer && track) {
    muted = peer.isLocal ? !track.enabled : track.volume === 0;
  }

  return { peer, track, muted, onToggle: handleMute };
};
