import React, { Suspense, useState, useEffect } from "react";
import { FaSyncAlt, FaCheck } from "react-icons/fa";


import {
  selectIsConnectedToRoom,
  selectLocalPeerRole,
  selectLocalPeerRoleName,
  selectPeerScreenSharing,
  selectPeerSharingAudio,
  selectPeerSharingVideoPlaylist,
  selectPeersByRole,
  selectTemplateAppData,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Flex } from "@100mslive/roomkit-react";
import FullPageProgress from "../components/FullPageProgress";
import EmbedView from "./EmbedView";
import { InsetView } from "./InsetView";
import { MainGridView } from "./mainGridView";
import { InterviewView } from "./interviewView";
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
import { p2pquestion_refreshedEvent } from "../helpers/amplitudeHelper";
const isMobileWeb = window.innerWidth <= 768;
const WhiteboardView = React.lazy(() => import("./WhiteboardView"));
const HLSView = React.lazy(() => import("./HLSView"));
const ActiveSpeakerView = React.lazy(() => import("./ActiveSpeakerView"));
const PinnedTrackView = React.lazy(() => import("./PinnedTrackView"));
const learner = localStorage.getItem('learner');
const peerName = localStorage.getItem('name');
const NewCustomCard = ({ topics }) => {
  const hardcodedQuestions = [
    `Hi ${peerName}, please introduce yourself in around 60 seconds to your co-learner`,
    "Who is your favorite sports personality and why?[Give short description]",
    "What did you want to be when you were growing up?[Give short description]",
    "Imagine yourself in a different century and describe an average day in your life",
    "Which character from a book or movie would you most like to meet and why?"
  ];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleNext = () => {
    setIsAnswered(true);
    setTimeout(() => {
      setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % hardcodedQuestions.length);
      setIsAnswered(false);
    }, 500); // Delay to show the tick mark for a short time
  };

  return (
    <div className="custom-card" style={{ width: "100%", textAlign: "center" }}>
      <div
        className="card-content"
        style={{
          position: "fixed",
          bottom: "50px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "auto",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* <span
          style={{
            color: "#4CB7A4",
            marginRight: "10px",
            fontWeight: "400",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Question:
        </span> */}
        <span style={{ flex: 1, fontWeight: "400", fontFamily: "Poppins, sans-serif", marginRight: "5px" }}>
          {hardcodedQuestions[currentQuestionIndex]}
        </span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={handleNext}
            className="next-button"
            style={{
              backgroundColor: isAnswered ? "#28a745" : "#007bff",
              color: "#fff",
              border: "none",
              padding: "5px",
              borderRadius: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            {isAnswered ? <FaCheck /> : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

const CustomCard = ({ topics }) => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestion = () => {
    setIsLoading(true);
    fetch("https://conversationai-questions.clapingo.com/reading/question")
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          setQuestion(data.question);
        } else {
          // Handle API error if needed
        }
      })
      .catch(error => {
        // Handle fetch error if needed
        console.error('Fetch error:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleRefresh = () => {
    const amplitudeEventProperties = {
      question
    }
    const amplitudeUserProperties = {
      user_id: learner
    }

    p2pquestion_refreshedEvent(amplitudeUserProperties, amplitudeEventProperties)

    fetchQuestion();
  };

  return (



    <div className="custom-card" style={{ width: "100%", textAlign: "center" }}>
      {isMobileWeb ? (
        <div className="custom-card" style={{ width: "100%", textAlign: "center" }}>
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
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Topic:
            </span>
            <span style={{ flex: 1, fontWeight: "400", fontFamily: "Poppins, sans-serif", marginRight: "5px" }}>
              {isLoading ? "Loading..." : question || topics[0]}
            </span>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                onClick={handleRefresh}
                className="refresh-button"
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
                <FaSyncAlt style={{ marginRight: "5px" }} />
                Refresh
              </button>
            </div>
          </div>
        </div>

      ) : (
        <div
          className="card-content"
          style={{
            position: "fixed",
            bottom: "50px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "auto", // Dynamic width
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
          <span style={{ flex: 1, fontWeight: "400", fontFamily: "Poppins, sans-serif", marginRight: "5px" }}>
            {isLoading ? "Loading..." : question || topics[0]}
          </span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={handleRefresh}
              className="refresh-button"
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
              <FaSyncAlt style={{ marginRight: "5px" }} />
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>



  );
};



export const ConferenceMainView = () => {
  const [peer, setPeer] = useState(false);
  const [topics] = useState([
    "Introduction",
    "Agenda Overview",
    "Keynote Speaker",
    "Breakout Sessions",
    "Q&A Session",
  ]);
  const { whiteboardOwner: whiteboardShared } = useWhiteboardMetadata();
  const peerSharing = useHMSStore(selectPeerScreenSharing);
  const peerSharingPlaylist = useHMSStore(selectPeerSharingVideoPlaylist);
  const pinnedTrack = usePinnedTrack();
  const peerSharingAudio = useHMSStore(selectPeerSharingAudio);
  const localPeerRole = useHMSStore(selectLocalPeerRoleName);
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

  const storedLearnerPeerValue = localStorage.getItem('isPeerLearner');
  const storedInstantDemoValue = localStorage.getItem('isInstantDemo');
  const endTime = localStorage.getItem('endTime');
  const currentHours = new Date().getUTCHours();
  const currentMinutes = new Date().getUTCMinutes();
  const currentSeconds = new Date().getUTCSeconds();
  const currentMilliseconds = new Date().getUTCMilliseconds();
  const role = useHMSStore(selectLocalPeerRole);
  const formattedTime = `${currentHours}:${currentMinutes}:${currentSeconds}.${currentMilliseconds}`;

  console.log("is mod", role.name);

  // Parse end time to get hours and minutes
  const [endHours, endMinutes] = endTime.split(":").map(num => parseInt(num, 10));

  // Calculate total remaining time in minutes
  const totalRemainingMinutes = (endHours * 60 + endMinutes) - (new Date().getUTCHours() * 60 + new Date().getUTCMinutes());

  // Convert total remaining minutes to seconds
  const totalRemainingSeconds = totalRemainingMinutes * 60 - currentSeconds;

  // Countdown state
  const [countdown, setCountdown] = useState(totalRemainingSeconds);

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown === 0) {
          clearInterval(timer); // Stop the timer if countdown reaches zero
          return 0;
        } else {
          return prevCountdown - 1;
        }
      });
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, []);


  // Alert when countdown reaches zero
  useEffect(() => {
    if (countdown === 0) {
      console.log("Time's up!");
    }
  }, [countdown]);


  useEffect(() => {
    if (!isConnected) {
      return;
    }
    const audioPlaylist = JSON.parse(process.env.REACT_APP_AUDIO_PLAYLIST || "[]");
    if (audioPlaylist.length > 0) {
      hmsActions.audioPlaylist.setList(audioPlaylist);
    }

    hmsActions.sessionStore.observe([
      SESSION_STORE_KEY.PINNED_MESSAGE,
      SESSION_STORE_KEY.SPOTLIGHT,
    ]);
  }, [isConnected, hmsActions]);

  if (!localPeerRole) {
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
  } else if (localPeerRole === "moderator") {
    ViewComponent = InterviewView;
  } else if (localPeerRole === "interviewee") {
    ViewComponent = InterviewView;
  } else if (localPeerRole === "candidate") {
    ViewComponent = InterviewView;
  }
  else {
    ViewComponent = MainGridView;
  }


  const isFirstSession = true
  console.log(localPeerRole, "local")

  return (
    <Suspense fallback={<FullPageProgress />}>
    <Flex
      css={{
        width: "100%",
        height: storedLearnerPeerValue == 'true' ? (isMobileWeb ? "80%" : "95%") : "100%",
        position: "relative",
      }}
    >
      <ViewComponent />
      <SidePane />
    </Flex>
    {isFirstSession ? (
      <NewCustomCard topics={topics} />
    ) : (
      storedLearnerPeerValue == 'true' && <CustomCard topics={topics} />
    )}
    {(storedLearnerPeerValue === 'true' || role.name === 'moderator') && (
      <div style={{ position: "fixed", top: "10px", left: "50%", transform: "translateX(-50%)", fontSize: "18px", fontWeight: "bold", color: countdown <= 120 ? "#ff0000" : "#fff" }}>
        {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? "0" : ""}{countdown % 60}
      </div>
    )}
  </Suspense>
);
};