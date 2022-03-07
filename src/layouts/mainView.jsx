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
} from "@100mslive/react-sdk";
import { ScreenShareView } from "./screenShareView";
import { MainGridView } from "./mainGridView";
import { ActiveSpeakerView } from "./ActiveSpeakerView";
import { HLSView } from "./HLSView";
import { WhiteboardView } from "./WhiteboardView";
import { AppContext } from "../components/context/AppContext";
import { useWhiteboardMetadata } from "../plugins/whiteboard";
import { useBeamAutoLeave } from "../common/hooks";

export const ConferenceMainView = ({ isChatOpen, toggleChat }) => {
  const localPeer = useHMSStore(selectLocalPeer);
  const peerSharing = useHMSStore(selectPeerScreenSharing);
  const peerSharingAudio = useHMSStore(selectPeerSharingAudio);
  const peerSharingPlaylist = useHMSStore(selectPeerSharingVideoPlaylist);
  const { whiteboardOwner: whiteboardShared } = useWhiteboardMetadata();
  const roomState = useHMSStore(selectRoomState);
  useBeamAutoLeave();
  const hmsActions = useHMSActions();
  const {
    audioPlaylist,
    videoPlaylist,
    uiViewMode,
    HLS_VIEWER_ROLE,
    showStatsOnTiles,
  } = useContext(AppContext);
  useEffect(() => {
    // set list only when room state is connected
    if (roomState !== HMSRoomState.Connected) {
      return;
    }
    if (videoPlaylist.length > 0) {
      hmsActions.videoPlaylist.setList(videoPlaylist);
    }
    if (audioPlaylist.length > 0) {
      hmsActions.audioPlaylist.setList(audioPlaylist);
    }
  }, [roomState, videoPlaylist, audioPlaylist, hmsActions]);

  if (!localPeer) {
    // we don't know the role yet to decide how to render UI
    return null;
  }

  let ViewComponent;
  if (localPeer.roleName === HLS_VIEWER_ROLE) {
    ViewComponent = HLSView;
  } else if (whiteboardShared) {
    ViewComponent = WhiteboardView;
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
        showStats={showStatsOnTiles}
      />
    )
  );
};
