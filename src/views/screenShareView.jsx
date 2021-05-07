import React, { useEffect, useState, useContext } from "react";
import { VideoList, ChatBox, VideoTile } from "@100mslive/sdk-components";
import { useHMSRoom } from "@100mslive/sdk-components";
import { AppContext } from "../store/AppContext";
import {
  HMSPeerToScreenStreamWitnInfo,
  HMSPeertoCameraStreamWithInfo,
  isScreenSharing,
} from "../utlis/index";

const TransformVideoTileSizes = (
  streamsWithInfo,
  isChatOpen,
  cameraStream,
  toggleChat,
  aspectRatio
) => {
  const { messages, sendMessage } = useHMSRoom();
  return (
    <>
      <div className={`w-full h-full relative`}>
        <div className={`w-full flex flex-col h-full`}>
          <div
            className="w-full relative overflow-hidden"
            style={{
              paddingTop: `${cameraStream && !isChatOpen ? "100%" : "0"}`,
            }}
          >
            {cameraStream && !isChatOpen && (
              <div className="absolute left-0 top-0 w-full h-full p-3">
                <VideoTile
                  audioTrack={cameraStream.audioTrack}
                  videoTrack={cameraStream.videoTrack}
                  peer={cameraStream.peer}
                  aspectRatio={aspectRatio}
                  showAudioMuteStatus={true}
                  allowRemoteMute={true}
                  isLocal={cameraStream.isLocal}
                  isAudioMuted={
                    !(
                      cameraStream.audioTrack && cameraStream.audioTrack.enabled
                    )
                  }
                  isVideoMuted={
                    !(
                      cameraStream.videoTrack && cameraStream.videoTrack.enabled
                    )
                  }
                  audioLevel={cameraStream.audioLevel}
                />
              </div>
            )}
          </div>
          <div
            className={`w-full relative ${isChatOpen ? "h-1/3" : "flex-grow"}`}
          >
            {streamsWithInfo && streamsWithInfo.length > 0 && (
              <VideoList
                streams={
                  isChatOpen
                    ? [cameraStream, ...streamsWithInfo]
                    : streamsWithInfo
                }
                classes={{
                  videoTileContainer: "rounded-lg p-2",
                }}
                showAudioMuteStatus={true}
                allowRemoteMute={true}
                maxColCount={2}
                overflow="scroll-x"
              />
            )}
          </div>
        </div>
        {isChatOpen && (
          <div className="h-2/3 w-full absolute z-10 bottom-0 right-0">
            <ChatBox
              messages={messages}
              onSend={sendMessage}
              onClose={toggleChat}
            />
          </div>
        )}
      </div>
    </>
  );
};

export const ScreenShareView = () => {
  const { isChatOpen, toggleChat, aspectRatio } = useContext(AppContext);
  const { peers, speakers } = useHMSRoom();
  const [streamsWithInfo, setStreamsWithInfo] = useState([]);
  const [screenStream, setScreenStream] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);

  useEffect(() => {
    if (!(peers && peers.length > 0 && peers[0])) return;

    console.debug("app: Old streams info ");
    console.debug("app: Re-rendering video list with new peers ", peers);

    const index = peers.findIndex(isScreenSharing);

    const screenSharingPeer = peers[index];
    let remPeers = [...peers];

    if (index !== -1) {
      remPeers.splice(index, 1);
      console.log("screen shared by", screenSharingPeer);
      setScreenStream(
        HMSPeerToScreenStreamWitnInfo(screenSharingPeer, speakers)
      );
      setCameraStream(
        HMSPeertoCameraStreamWithInfo(screenSharingPeer, speakers)
      );
    } else {
      setCameraStream(null);
      setScreenStream(null);
    }
    const videoStreamsWithInfo = remPeers
      .filter((peer) => Boolean(peer.videoTrack || peer.audioTrack))
      .map((peer) => HMSPeertoCameraStreamWithInfo(peer, speakers));
    console.debug("app: Computed camera streams info ", videoStreamsWithInfo);

    const screenShareStreamsWithInfo = remPeers
      .filter(isScreenSharing)
      .map((peer) => HMSPeerToScreenStreamWitnInfo(peer, speakers));

    console.debug(
      "app: Computed screenshare streams info ",
      screenShareStreamsWithInfo
    );
    setStreamsWithInfo([
      ...videoStreamsWithInfo,
      ...screenShareStreamsWithInfo,
    ]);
  }, [peers]);

  useEffect(() => {
    console.debug("app: Streams with info", streamsWithInfo);
  }, [streamsWithInfo]);

  return (
    <React.Fragment>
      <div className="w-full h-full flex">
        <div className="w-8/10 h-full">
          {screenStream && screenStream.videoTrack && (
            <VideoTile
              audioTrack={screenStream.audioTrack}
              videoTrack={screenStream.videoTrack}
              peer={screenStream.peer}
              videoSource="screen"
              showAudioMuteStatus={true}
              allowRemoteMute={true}
              isLocal={screenStream.isLocal}
              objectFit="contain"
              isAudioMuted={
                !(screenStream.audioTrack && screenStream.audioTrack.enabled)
              }
              isVideoMuted={
                !(screenStream.videoTrack && screenStream.videoTrack.enabled)
              }
            />
          )}
        </div>

        <div className="flex flex-wrap overflow-hidden p-2 w-2/10 h-full ">
          {TransformVideoTileSizes(
            streamsWithInfo,
            isChatOpen,
            cameraStream,
            toggleChat,
            aspectRatio
          )}
        </div>
      </div>

      {/* <VideoList
          streams={streamsWithInfo.filter((peer) => peer.role === "Teacher")}
          classes={{
            videoTileParent: "p-5 rounded-xl",
            video: "rounded-xl",
          }}
          overflow="scroll-x"
          maxTileCount={4}
          showAudioMuteStatus={false}
        /> */}
    </React.Fragment>
  );
};
