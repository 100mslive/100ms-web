import React, { useEffect } from "react";
import {
  useHMSStore,
  useHMSActions,
  HMSRoomState,
  selectLocalPeer,
  selectPeerSharingAudio,
  selectPeerScreenSharing,
  selectPeerSharingVideoPlaylist,
  selectRoomState,
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
  const roomState = useHMSStore(selectRoomState);
  const hmsActions = useHMSActions();

  useEffect(() => {
    // set list only when room state is connected
    if (roomState !== HMSRoomState.Connected) {
      return;
    }
    hmsActions.videoPlaylist.setList(defaultVideoList);
    hmsActions.audioPlaylist.setList(defaultAudioList);
  }, [roomState]); //eslint-disable-line

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
