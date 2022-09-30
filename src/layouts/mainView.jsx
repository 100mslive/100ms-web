import React, { useEffect, Suspense } from "react";
import {
  useHMSStore,
  useHMSActions,
  selectPeerSharingAudio,
  selectPeerScreenSharing,
  selectPeerSharingVideoPlaylist,
  selectLocalPeerRoleName,
  selectIsConnectedToRoom,
} from "@100mslive/react-sdk";
import { Flex } from "@100mslive/react-ui";
import { MainGridView } from "./mainGridView";
import SidePane from "./SidePane";
import FullPageProgress from "../components/FullPageProgress";
import ScreenShareView from "./screenShareView";
import {
  useHLSViewerRole,
  useIsHeadless,
  useUISettings,
} from "../components/AppData/useUISettings";
import { useBeamAutoLeave } from "../common/hooks";
import { useWhiteboardMetadata } from "../plugins/whiteboard";
import { useAppConfig } from "../components/AppData/useAppConfig";
import { UI_MODE_ACTIVE_SPEAKER } from "../common/constants";
import { useRefreshSessionMetadata } from "../components/hooks/useRefreshSessionMetadata";

const WhiteboardView = React.lazy(() => import("./WhiteboardView"));
const HLSView = React.lazy(() => import("./HLSView"));
const ActiveSpeakerView = React.lazy(() => import("./ActiveSpeakerView"));

export const ConferenceMainView = () => {
  const localPeerRole = useHMSStore(selectLocalPeerRoleName);
  const peerSharing = useHMSStore(selectPeerScreenSharing);
  const peerSharingAudio = useHMSStore(selectPeerSharingAudio);
  const peerSharingPlaylist = useHMSStore(selectPeerSharingVideoPlaylist);
  const { whiteboardOwner: whiteboardShared } = useWhiteboardMetadata();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  useBeamAutoLeave();
  useRefreshSessionMetadata();
  const hmsActions = useHMSActions();
  const isHeadless = useIsHeadless();
  const headlessUIMode = useAppConfig("headlessConfig", "uiMode");
  const { uiViewMode, isAudioOnly } = useUISettings();
  const hlsViewerRole = useHLSViewerRole();
  useEffect(() => {
    if (!isConnected) {
      return;
    }
    const audioPlaylist = JSON.parse(
      process.env.REACT_APP_AUDIO_PLAYLIST || "[]"
    );
    const videoPlaylist = JSON.parse(
      process.env.REACT_APP_VIDEO_PLAYLIST || "[]"
    );
    if (videoPlaylist.length > 0) {
      hmsActions.videoPlaylist.setList(videoPlaylist);
    }
    if (audioPlaylist.length > 0) {
      hmsActions.audioPlaylist.setList(audioPlaylist);
    }
  }, [isConnected, hmsActions]);

  if (!localPeerRole) {
    // we don't know the role yet to decide how to render UI
    return null;
  }

  let ViewComponent;
  if (localPeerRole === hlsViewerRole) {
    ViewComponent = HLSView;
  } else if (whiteboardShared) {
    ViewComponent = WhiteboardView;
  } else if (
    ((peerSharing && peerSharing.id !== peerSharingAudio?.id) ||
      peerSharingPlaylist) &&
    !isAudioOnly
  ) {
    ViewComponent = ScreenShareView;
  } else if (
    uiViewMode === UI_MODE_ACTIVE_SPEAKER ||
    (isHeadless && headlessUIMode === UI_MODE_ACTIVE_SPEAKER)
  ) {
    ViewComponent = ActiveSpeakerView;
  } else {
    ViewComponent = MainGridView;
  }

  return (
    <Suspense fallback={<FullPageProgress />}>
      <Flex css={{ size: "100%", position: "relative" }}>
        <ViewComponent />
        <SidePane />
      </Flex>
    </Suspense>
  );
};
