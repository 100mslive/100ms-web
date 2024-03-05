import React, { Suspense, useState, useEffect } from "react";
import { FaLongArrowAltLeft,FaLongArrowAltRight } from "react-icons/fa";

import {
  selectIsConnectedToRoom,
  selectLocalPeerRoleName,
  selectPeerScreenSharing,
  selectPeerSharingAudio,
  selectPeerSharingVideoPlaylist,
  selectTemplateAppData,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import 'react-toastify/dist/ReactToastify.css';
import { Flex } from "@100mslive/roomkit-react";
import FullPageProgress from "../components/FullPageProgress";
import EmbedView from "./EmbedView";
import { InsetView } from "./InsetView";
import { MainGridView } from "./mainGridView";
import PDFView from "./PDFView";
import ScreenShareView from "./screenShareView";
import SidePane from "./SidePane";
import { WaitingView } from "./WaitingView";
import { useWhiteboardMetadata } from "../plugins/whiteboard";
import { useAppConfig } from "../components/AppData/useAppConfig";
import {
  useHLSViewerRole,
  useIsHeadless,
  usePDFConfig,
  usePinnedTrack,
  useUISettings,
  useUrlToEmbed,
  useWaitingViewerRole,
} from "../components/AppData/useUISettings";
import { SESSION_STORE_KEY, UI_MODE_ACTIVE_SPEAKER } from "../common/constants";

const WhiteboardView = React.lazy(() => import("./WhiteboardView"));
const HLSView = React.lazy(() => import("./HLSView"));
const ActiveSpeakerView = React.lazy(() => import("./ActiveSpeakerView"));
const PinnedTrackView = React.lazy(() => import("./PinnedTrackView"));

const CustomCard = ({ topics, onClose }) => {
  const [topicIndex, setTopicIndex] = useState(0);

  const handleNextTopic = () => {
    if (topicIndex < topics.length - 1) {
      setTopicIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevTopic = () => {
    if (topicIndex > 0) {
      setTopicIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div
      className="custom-card"
      style={{
        position: "fixed",
        bottom: "50px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "auto", // Dynamic width
      }}
    >
      <div
        className="card-content"
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "#4CB7A4",
            marginRight: "10px",
            fontWeight: "400",
            fontFamily: "Poppins, sans-serif", // Apply Poppins font to the "Topic" text
          }}
        >
          Topic:
        </span>
        <span style={{ flex: 1, fontWeight: "400", fontFamily: "Poppins, sans-serif", marginRight:"5px" }}>{topics[topicIndex]}</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          {topicIndex > 0 && (
            <button
              onClick={handlePrevTopic}
              className="prev-button"
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                padding: "5px",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaLongArrowAltLeft style={{ marginRight: "5px" }} />
              Previous
            </button>
          )}
          {topicIndex < topics.length - 1 && (
            <button
              onClick={handleNextTopic}
              className="next-button"
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                padding: "5px",
                borderRadius: "5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              Next
              <FaLongArrowAltRight style={{ marginLeft: "5px" }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};



export const ConferenceMainView = () => {
  const [showCard, setShowCard] = useState(true);
  const [topics] = useState([
    "Introduction",
    "Agenda Overview",
    "Keynote Speaker",
    "Breakout Sessions",
    "Q&A Session",
  ]);

  const handleCloseCard = () => {
    setShowCard(false);
  };

  const localPeerRole = useHMSStore(selectLocalPeerRoleName);
  const pinnedTrack = usePinnedTrack();
  const peerSharing = useHMSStore(selectPeerScreenSharing);
  const peerSharingAudio = useHMSStore(selectPeerSharingAudio);
  const peerSharingPlaylist = useHMSStore(selectPeerSharingVideoPlaylist);
  const { whiteboardOwner: whiteboardShared } = useWhiteboardMetadata();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const uiMode = useHMSStore(selectTemplateAppData).uiMode;
  const hmsActions = useHMSActions();
  const isHeadless = useIsHeadless();
  const headlessUIMode = useAppConfig("headlessConfig", "uiMode");
  const { uiViewMode, isAudioOnly } = useUISettings();
  const hlsViewerRole = useHLSViewerRole();
  const waitingViewerRole = useWaitingViewerRole();
  const embedConfig = useUrlToEmbed();
  const pdfConfig = usePDFConfig();

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

    hmsActions.sessionStore.observe([
      SESSION_STORE_KEY.PINNED_MESSAGE,
      SESSION_STORE_KEY.SPOTLIGHT,
    ]);
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
  } else if (embedConfig) {
    ViewComponent = EmbedView;
  } else if (pdfConfig) {
    ViewComponent = PDFView;
  } else if (whiteboardShared) {
    ViewComponent = WhiteboardView;
  } else if (uiMode === "inset") {
    ViewComponent = InsetView;
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
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <ViewComponent />
        <SidePane />
      </Flex>
      {/* {showCard && <CustomCard topics={topics} onClose={handleCloseCard} />} */}
    </Suspense>
  );
};
