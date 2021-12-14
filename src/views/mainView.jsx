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
import { HLSView } from "./HLSView";
import { AppContext } from "../store/AppContext";
import { metadataProps as videoTileProps } from "../common/utils";
import { DEFAULT_HLS_ROLE, DEFAULT_HLS_ROLE_KEY } from "../common/constants";

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
  const { audioPlaylist, videoPlaylist, uiViewMode, roomMetadata } =
    useContext(AppContext);
  let HLSViewerRole = roomMetadata[DEFAULT_HLS_ROLE_KEY] || DEFAULT_HLS_ROLE;

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

  if (localPeer.roleName === HLSViewerRole) {
    ViewComponent = HLSView;
  } else if (
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
