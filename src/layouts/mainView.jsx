import React, { useEffect, useContext, Suspense } from "react";
import {
  useHMSStore,
  useHMSActions,
  HMSRoomState,
  selectPeerSharingAudio,
  selectPeerScreenSharing,
  selectPeerSharingVideoPlaylist,
  selectRoomState,
  selectLocalPeerRoleName,
} from "@100mslive/react-sdk";
import { MainGridView } from "./mainGridView";
import { AppContext } from "../components/context/AppContext";
import FullPageProgress from "../components/FullPageProgress";
import ScreenShareView from "./screenShareView";
import { useWhiteboardMetadata } from "../plugins/whiteboard";
import { useBeamAutoLeave } from "../common/hooks";
import { UI_MODE_ACTIVE_SPEAKER, UI_SETTINGS } from "../common/constants";
import { useUISettings } from "../components/AppData/useUISettings";

const WhiteboardView = React.lazy(() => import("./WhiteboardView"));
const HLSView = React.lazy(() => import("./HLSView"));
const ActiveSpeakerView = React.lazy(() => import("./ActiveSpeakerView"));

export const ConferenceMainView = () => {
  const localPeerRole = useHMSStore(selectLocalPeerRoleName);
  const peerSharing = useHMSStore(selectPeerScreenSharing);
  const peerSharingAudio = useHMSStore(selectPeerSharingAudio);
  const peerSharingPlaylist = useHMSStore(selectPeerSharingVideoPlaylist);
  const isAudioOnly = useUISettings(UI_SETTINGS.isAudioOnly);
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

  if (!localPeerRole) {
    // we don't know the role yet to decide how to render UI
    return null;
  }

  let ViewComponent;
  if (localPeerRole === HLS_VIEWER_ROLE) {
    ViewComponent = HLSView;
  } else if (whiteboardShared) {
    ViewComponent = WhiteboardView;
  } else if (
    ((peerSharing && peerSharing.id !== peerSharingAudio?.id) ||
      peerSharingPlaylist) &&
    !isAudioOnly
  ) {
    ViewComponent = ScreenShareView;
  } else if (uiViewMode === UI_MODE_ACTIVE_SPEAKER) {
    ViewComponent = ActiveSpeakerView;
  } else {
    ViewComponent = MainGridView;
  }

  return (
    ViewComponent && (
      <Suspense fallback={<FullPageProgress />}>
        <ViewComponent showStats={showStatsOnTiles} />
      </Suspense>
    )
  );
};
