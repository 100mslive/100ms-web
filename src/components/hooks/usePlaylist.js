import {
  HMSPlaylistType,
  selectAudioPlaylist,
  selectVideoPlaylist,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";

export const usePlaylist = type => {
  const isAudioPlaylist = type === HMSPlaylistType.audio;
  const selector = isAudioPlaylist ? selectAudioPlaylist : selectVideoPlaylist;
  const active = useHMSStore(selector.selectedItem);
  const selection = useHMSStore(selector.selection);
  const playlist = useHMSStore(selector.list);
  const hmsActions = useHMSActions();
  const playlistAction = isAudioPlaylist
    ? hmsActions.audioPlaylist
    : hmsActions.videoPlaylist;

  return {
    active,
    hasNext: selection.hasNext,
    hasPrevious: selection.hasPrevious,
    actions: playlistAction,
    list: playlist,
  };
};
