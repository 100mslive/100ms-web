import React, { Suspense, useEffect } from "react";
import {
  selectIsConnectedToRoom,
  selectLocalPeerRoleName,
  selectPeerScreenSharing,
  selectPeerSharingAudio,
  selectPeerSharingVideoPlaylist,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Flex } from "@100mslive/react-ui";
import FullPageProgress from "../components/FullPageProgress";
import EmbedView from "./EmbedView";
import { MainGridView } from "./mainGridView";
import ScreenShareView from "./screenShareView";
import SidePane from "./SidePane";
import { WaitingView } from "./WaitingView";
import { useWhiteboardMetadata } from "../plugins/whiteboard";
import { useAppConfig } from "../components/AppData/useAppConfig";
import {
  useHLSViewerRole,
  useIsHeadless,
  usePinnedTrack,
  useUISettings,
  useUrlToEmbed,
  useWaitingViewerRole,
} from "../components/AppData/useUISettings";
import { useRefreshSessionMetadata } from "../components/hooks/useRefreshSessionMetadata";
import { useBeamAutoLeave } from "../common/hooks";
import { UI_MODE_ACTIVE_SPEAKER } from "../common/constants";

const WhiteboardView = React.lazy(() => import("./WhiteboardView"));
const HLSView = React.lazy(() => import("./HLSView"));
const ActiveSpeakerView = React.lazy(() => import("./ActiveSpeakerView"));
const PinnedTrackView = React.lazy(() => import("./PinnedTrackView"));

export const ConferenceMainView = () => {
  const localPeerRole = useHMSStore(selectLocalPeerRoleName);
  const pinnedTrack = usePinnedTrack();
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
  const waitingViewerRole = useWaitingViewerRole();
  const urlToIframe = useUrlToEmbed();
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
  } else if (localPeerRole === waitingViewerRole) {
    ViewComponent = WaitingView;
  } else if (urlToIframe) {
    ViewComponent = EmbedView;
  } else if (whiteboardShared) {
    ViewComponent = WhiteboardView;
  } else if (
    ((peerSharing && peerSharing.id !== peerSharingAudio?.id) ||
      peerSharingPlaylist) &&
    !isAudioOnly
  ) {
    ViewComponent = ScreenShareView;
  } else if (pinnedTrack) {
    ViewComponent = PinnedTrackView;
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
      <Flex
        css={{
          size: "100%",
          position: "relative",
        }}
      >
        <ViewComponent />
        <SidePane />
      </Flex>
    </Suspense>
  );
};
