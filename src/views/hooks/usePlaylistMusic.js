import { useCallback } from "react";
import {
  selectAudioPlaylist,
  selectAudioPlaylistTrackByPeerID,
  selectPeerSharingAudioPlaylist,
  useHMSStore,
  useHMSActions,
} from "@100mslive/react-sdk";

export const usePlaylistMusic = () => {
  const peer = useHMSStore(selectPeerSharingAudioPlaylist);
  const track = useHMSStore(selectAudioPlaylistTrackByPeerID(peer?.id));
  const selection = useHMSStore(selectAudioPlaylist.selectedItem);
  const hmsActions = useHMSActions();

  const play = useCallback(
    async selectedId => {
      await hmsActions.audioPlaylist.play(selectedId);
    },
    [hmsActions]
  );

  const pause = useCallback(() => {
    hmsActions.audioPlaylist.pause();
  }, [hmsActions]);

  const setVolume = useCallback(
    value => {
      hmsActions.audioPlaylist.setVolume(value);
    },
    [hmsActions]
  );

  if (!peer || !track) {
    return null;
  }
  // Don't show mute option if remote peer has disabled
  if (!peer.isLocal && !track.enabled) {
    return null;
  }

  if (peer.isLocal && !selection) {
    return null;
  }
  return { selection, peer, track, play, pause, setVolume };
};
