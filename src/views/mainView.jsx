import React, { useEffect, useContext } from "react";
import {
  useHMSStore,
  useHMSActions,
  HMSRoomState,
  selectPeerSharingAudio,
  selectPeerScreenSharing,
  selectPeerSharingVideoPlaylist,
  selectRoomState,
  selectLocalPeer,
} from "@100mslive/hms-video-react";
import { ScreenShareView } from "./screenShareView";
import { MainGridView } from "./mainGridView";
import { ActiveSpeakerView } from "./ActiveSpeakerView";
import { AppContext } from "../store/AppContext";
import { metadataProps as videoTileProps } from "../common/utils";

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
  const { audioPlaylist, videoPlaylist, uiViewMode } = useContext(AppContext);
  useEffect(() => {
    // set list only when room state is connected
    if (roomState !== HMSRoomState.Connected) {
      return;
    }
    hmsActions.videoPlaylist.setList(videoPlaylist);
    hmsActions.audioPlaylist.setList(audioPlaylist);
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
  } else if (uiViewMode === "activeSpeaker") {
    ViewComponent = ActiveSpeakerView;
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
        videoTileProps={videoTileProps}
      />
    )
  );
};
