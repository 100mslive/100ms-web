import { useState, useCallback, useRef } from "react";
import {
  useHMSStore,
  ControlBar,
  AudioPlaylist,
  VirtualBackgroundIcon,
  NoiseSupressionIcon,
  Button,
  ShareScreenIcon,
  ChatIcon,
  ChatUnreadIcon,
  MusicIcon,
  VideoPlaylistIcon,
  VerticalDivider,
  MessageModal,
  useHMSActions,
  selectIsLocalScreenShared,
  selectUnreadHMSMessagesCount,
  isMobileDevice,
  selectIsAllowedToPublish,
  selectIsLocalVideoPluginPresent,
  selectIsLocalAudioPluginPresent,
  selectLocalPeerID,
  selectScreenSharesByPeerId,
  selectVideoPlaylist,
  VideoPlaylist,
  selectIsConnectedToRoom,
  HandIcon,
} from "@100mslive/hms-video-react";
import { HMSVirtualBackgroundPlugin } from "@100mslive/hms-virtual-background";
import { HMSNoiseSuppressionPlugin } from "@100mslive/hms-noise-suppression";
import { getRandomVirtualBackground } from "../common/utils";
import { MoreSettings } from "./components/MoreSettings";
import { AudioVideoToggle } from "./components/AudioVideoToggle";
import { LeaveRoom } from "./components/LeaveRoom";
import { useMetadata } from "./hooks/useMetadata";

export const ConferenceFooter = ({ isChatOpen, toggleChat }) => {
  const isScreenShared = useHMSStore(selectIsLocalScreenShared);
  const localPeer = useHMSStore(selectLocalPeerID);
  const { video, audio } = useHMSStore(selectScreenSharesByPeerId(localPeer));
  const countUnreadMessages = useHMSStore(selectUnreadHMSMessagesCount);
  const isVBPresent = useHMSStore(
    selectIsLocalVideoPluginPresent("@100mslive/hms-virtual-background")
  );
  var isSTTPresent = false;
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);

  const pluginRef = useRef(null);
  const audiopluginRef = useRef(null);
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const activeVideoPlaylist = useHMSStore(selectVideoPlaylist.selection).id;
  const [shareAudioModal, setShareAudioModal] = useState(false);
  const { isHandRaised, setIsHandRaised } = useMetadata();
  const isNoiseSuppression = useHMSStore(
    selectIsLocalAudioPluginPresent("@100mslive/hms-noise-suppression")
  );
  const initialModalProps = {
    show: false,
    title: "",
    body: "",
  };
  const [errorModal, setErrorModal] = useState(initialModalProps);

  function createNoiseSuppresionPlugin() {
    if (!audiopluginRef.current) {
      audiopluginRef.current = new HMSNoiseSuppressionPlugin();
    }
  }

  async function addNoiseSuppressionPlugin() {
    createNoiseSuppresionPlugin();
    try {
      await hmsActions.addPluginToAudioTrack(audiopluginRef.current);
    } catch (err) {
      console.error("add noise suppression plugin failed", err);
    }
  }

  async function removeNoiseSuppressionPlugin() {
    if (audiopluginRef.current) {
      await hmsActions.removePluginFromAudioTrack(audiopluginRef.current);
      audiopluginRef.current = null;
    }
  }

  function createVBPlugin() {
    if (!pluginRef.current) {
      pluginRef.current = new HMSVirtualBackgroundPlugin("none", true);
    }
  }

  async function startPlugin() {
    //create plugin if not present
    createVBPlugin();
    window.HMS.virtualBackground = pluginRef.current;
    try {
      await pluginRef.current.setBackground(getRandomVirtualBackground());
      //Running VB on every alternate frame rate for optimized cpu usage
      await hmsActions.addPluginToVideoTrack(pluginRef.current, 15);
    } catch (err) {
      console.error("add virtual background plugin failed", err);
    }
  }

  async function removePlugin() {
    if (pluginRef.current) {
      await hmsActions.removePluginFromVideoTrack(pluginRef.current);
      pluginRef.current = null;
    }
  }

  function handleVirtualBackground() {
    isVBPresent ? removePlugin() : startPlugin();
  }



  //####################################################
  //Trascription Code Starts Here
  
  var speechRecognizer;
  var speechTxt = "";
  function createSTTPlugin() {
    console.log("STT Begins");
    isSTTPresent = true;
    if("webkitSpeechRecognition" in window){
      speechRecognizer = new window.webkitSpeechRecognition();
      var STARTED = false;
      var STOP_FLAG = false;
      var exitcnt = 0;
      var interim_transcript;
          speechRecognizer.continuous = true;
          speechRecognizer.interimResults = true;
          if(STARTED == false){
              speechRecognizer.start();
              STARTED = true;
              speechRecognizer.onsoundstart = function() {
                  console.log('Some sound is being received');
              }
  
              speechRecognizer.onresult = function(event){
                  exitcnt = 0;
                  if(event.results.length > 0){
                      let final_transcript = interim_transcript = "";
                      for (let i = event.resultIndex; i < event.results.length; ++i) {
                          if (event.results[i].isFinal) {
                            final_transcript += event.results[i][0].transcript;
                          } else {
                            interim_transcript += event.results[i][0].transcript;
                          }
                        }
                      console.log(interim_transcript);
                      speechTxt = interim_transcript;
                      document.getElementById("speechtxt").innerText = interim_transcript;
                  }
              };
  
              speechRecognizer.onerror = function(event){
                  console.log(event)
              };
          
              speechRecognizer.onend = function(e) {
                  if(exitcnt <= 5){
                      console.log(e);
                      STARTED = false;
                      exitcnt++;
                  }else{
                    console.log("STT Error");
                  }
              }
          }
    }else{
      console.log("Sorry, your browser does not support this feature !!");
    }
  }

  async function startSTTPlugin() {
    console.log("Starting STT");
    createSTTPlugin();
    document.getElementById("t4txt").style.color = "#0fdf29";
  }

  async function removeSTTPlugin() {
    console.log("Stopping STT");
    if(speechRecognizer){
      speechRecognizer.stop();
    }
    isSTTPresent = false;
    document.getElementById("t4txt").style.color = "white";
  }

  function handleSTT() {
    isSTTPresent ? removeSTTPlugin() : startSTTPlugin();
  }

  // Trascription nds Here
  
  function handleNoiseSuppression() {
    isNoiseSuppression
      ? removeNoiseSuppressionPlugin()
      : addNoiseSuppressionPlugin();
  }

  const toggleScreenShare = useCallback(
    async (enable, audioOnly = false) => {
      try {
        await hmsActions.setScreenShareEnabled(enable, audioOnly);
      } catch (error) {
        if (
          error.description &&
          error.description.includes("denied by system")
        ) {
          setErrorModal({
            show: true,
            title: "Screen share permission denied by OS",
            body: "Please update your OS settings to permit screen share.",
          });
        } else if (error.message && error.message.includes("share audio")) {
          // when share audio not selected with audioOnly screenshare
          setErrorModal({
            show: true,
            title: "Screenshare error",
            body: error.message,
          });
        } else if (
          error.message &&
          error.message === "Cannot share multiple screens"
        ) {
          // when share audio not selected with audioOnly screenshare
          setErrorModal({
            show: true,
            title: "Screenshare error",
            body: error.message,
          });
        }
      }
    },
    [hmsActions]
  );

  const leftComponents = [];
  const isAudioScreenshare = !video && !!audio;

  if (!isMobileDevice()) {
    //creating VB button for only web
    createVBPlugin();
    createNoiseSuppresionPlugin();
    if (isAllowedToPublish.screen) {
      leftComponents.push(
        <Button
          key="shareAudio"
          iconOnly
          variant="no-fill"
          iconSize="md"
          shape="rectangle"
          active={isAudioScreenshare}
          onClick={() => {
            if (isAudioScreenshare) {
              toggleScreenShare(false, true);
            } else {
              setShareAudioModal(true);
            }
          }}
        >
          <MusicIcon />
        </Button>,
        <VerticalDivider key="audioShareDivider" />
      );
    }
    leftComponents.push(
      <Button
        key="chat"
        iconOnly
        variant="no-fill"
        iconSize="md"
        shape="rectangle"
        onClick={toggleChat}
        active={isChatOpen}
      >
        {countUnreadMessages === 0 ? <ChatIcon /> : <ChatUnreadIcon />}
      </Button>
    );
    isAllowedToPublish.screen &&
      leftComponents.push(<AudioPlaylist key="audioPlaylist" />);
    isAllowedToPublish.screen &&
      leftComponents.push(
        <VideoPlaylist
          key="videoPlaylist"
          trigger={<VideoPlaylistIcon key="videoPlaylistIcon" />}
          active={activeVideoPlaylist}
        />
      );
    leftComponents.push(
      <Button
        key="raise-hand"
        iconOnly
        variant="no-fill"
        iconSize="md"
        shape="rectangle"
        onClick={() => setIsHandRaised(!isHandRaised)}
        active={isHandRaised}
      >
        <HandIcon />
      </Button>
    );
  }
  if (isMobileDevice()) {
    leftComponents.push(
      <Button
        key="chat"
        iconOnly
        variant="no-fill"
        iconSize="md"
        shape="rectangle"
        onClick={toggleChat}
        active={isChatOpen}
      >
        {countUnreadMessages === 0 ? <ChatIcon /> : <ChatUnreadIcon />}
      </Button>
    );
    leftComponents.push(
      <Button
        key="raise-hand"
        iconOnly
        variant="no-fill"
        iconSize="md"
        shape="rectangle"
        onClick={() => setIsHandRaised(!isHandRaised)}
        active={isHandRaised}
      >
        <HandIcon />
      </Button>
    );
  }

  const isPublishing = isAllowedToPublish.video || isAllowedToPublish.audio;
  if (!isConnected) {
    return null;
  }

  return (
    <>
      <div id="speechtxt" className="transcribe"></div>
      <ControlBar
        leftComponents={leftComponents}
        centerComponents={[
          <AudioVideoToggle key="audioVideoToggle" />,
          isAllowedToPublish.screen && !isMobileDevice() ? (
            <Button
              key="toggleScreenShare"
              iconOnly
              variant="no-fill"
              iconSize="md"
              shape="rectangle"
              classes={{ root: "mx-2" }}
              onClick={() => toggleScreenShare(!isScreenShared)}
            >
              <ShareScreenIcon />
            </Button>
          ) : null,
          isAllowedToPublish.video && pluginRef.current?.isSupported() ? (
            <Button
              iconOnly
              variant="no-fill"
              shape="rectangle"
              active={isVBPresent}
              onClick={handleVirtualBackground}
              classes={{ root: "mx-2" }}
              key="VB"
            >
              <VirtualBackgroundIcon />
            </Button>
          ) : null,
          isAllowedToPublish.audio && audiopluginRef.current?.isSupported() ? (
            <Button
              iconOnly
              variant="no-fill"
              shape="rectangle"
              active={isNoiseSuppression}
              onClick={handleNoiseSuppression}
              key="noiseSuppression"
            >
              <NoiseSupressionIcon />
            </Button>
          ) : null,
          "webkitSpeechRecognition" in window && isAllowedToPublish.audio && audiopluginRef.current?.isSupported() ? (
            <Button
              iconOnly
              variant="no-fill"
              shape="rectangle"
              active={isSTTPresent}
              onClick={handleSTT}
              key="transcribe"
            >
              <span id="t4txt" title="Transcribe"><b>T</b></span>
            </Button>
          ) : null,
          isPublishing && (
            <span key="SettingsLeftSpace" className="mx-2 md:mx-3"></span>
          ),
          isPublishing && <VerticalDivider key="SettingsDivider" />,
          isPublishing && (
            <span key="SettingsRightSpace" className="mx-2 md:mx-3"></span>
          ),
          <MoreSettings key="MoreSettings" />,
        ]}
        rightComponents={[<LeaveRoom key="leaveRoom" />]}
        backgroundButtonOnClick={handleVirtualBackground}
        isBackgroundEnabled={isVBPresent}
      />
      <MessageModal
        {...errorModal}
        onClose={() => setErrorModal(initialModalProps)}
      />
      <MessageModal
        show={shareAudioModal}
        onClose={() => {
          setShareAudioModal(false);
        }}
        title="How to play music"
        body={
          <>
            <img
              src="/share-audio.png"
              className="mt-4"
              alt="select ‘Chrome Tab’ option in the share screen
          window, then click the ‘Share audio’ button"
            ></img>
          </>
        }
        footer={
          <Button
            variant="emphasized"
            onClick={() => {
              setShareAudioModal(false);
              toggleScreenShare(!isAudioScreenshare, true);
            }}
          >
            Continue
          </Button>
        }
        classes={{
          footer: "justify-center",
          header: "mb-2",
          boxTransition: "sm:max-w-4xl",
        }}
      />
    </>
  );
};
