import React, { useEffect } from "react";
import {
  useHMSStore,
  useHMSActions,
  HMSPlaylistActionType,
  selectLocalPeer,
  selectPeerSharingAudio,
  selectPeerScreenSharing,
  selectPeerSharingVideoPlaylist,
} from "@100mslive/hms-video-react";
import { ScreenShareView } from "./screenShareView";
import { MainGridView } from "./mainGridView";
import { defaultAudioList, defaultVideoList } from "../common/constants";

export const ConferenceMainView = ({
  isChatOpen,
  toggleChat,
  isParticipantListOpen,
}) => {
  const localPeer = useHMSStore(selectLocalPeer);
  const peerSharing = useHMSStore(selectPeerScreenSharing);
  const peerSharingAudio = useHMSStore(selectPeerSharingAudio);
  const peerSharingPlaylist = useHMSStore(selectPeerSharingVideoPlaylist);
  const hmsActions = useHMSActions();

  useEffect(() => {
    hmsActions.performActionOnPlaylist({
      actionType: HMSPlaylistActionType.SET_LIST,
      list: defaultVideoList,
      type: "video",
    });
    hmsActions.performActionOnPlaylist({
      actionType: HMSPlaylistActionType.SET_LIST,
      list: defaultAudioList,
      type: "audio",
    });
  }, [hmsActions]);

  if (!localPeer) {
    // we don't know the role yet to decide how to render UI
    return null;
  }

  let ViewComponent;

  if (
    (peerSharing && peerSharing.id !== peerSharingAudio?.id) ||
    peerSharingPlaylist
  ) {
    ViewComponent = ScreenShareView;
  } else {
    ViewComponent = MainGridView;
  }

  return (
    ViewComponent && (
      <ViewComponent
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
        role={localPeer.roleName}
        isParticipantListOpen={isParticipantListOpen}
      />
    )
  );
};
