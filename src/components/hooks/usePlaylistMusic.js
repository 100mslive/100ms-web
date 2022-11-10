import { useCallback } from "react";
import {
  selectAudioPlaylist,
  selectAudioPlaylistTrackByPeerID,
  selectPeerSharingAudioPlaylist,
  useHMSActions,
  useHMSStore,
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
      hmsActions.setVolume(value, track?.id);
    },
    [hmsActions, track]
  );

  return { selection, peer, track, play, pause, setVolume };
};
