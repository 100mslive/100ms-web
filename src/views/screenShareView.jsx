import React, { useEffect, useState, useContext } from "react";
import { VideoList, ChatBox, VideoTile } from "@100mslive/sdk-components";
import { useHMSRoom } from "@100mslive/sdk-components";
import { AppContext } from "../store/AppContext";
import {
  HMSPeerToScreenStreamWitnInfo,
  HMSPeertoCamerStreamWithInfo,
  isScreenSharing,
} from "../utlis/index";

const TransformVideoTileSizes = (
  streamsWithInfo,
  isChatOpen,
  cameraStream,
  toggleChat
) => {
  const { peers, messages, sendMessage } = useHMSRoom();
  if (streamsWithInfo.length == 0) {
    return (
      <>
        <div
          className={`w-full ${
            isChatOpen ? "h-1/4" : "h-full"
          } transition-height duration-500 ease-in-out`}
        >
          {cameraStream && (
            <VideoTile
              audioTrack={cameraStream.audioTrack}
              videoTrack={cameraStream.videoTrack}
              peer={cameraStream.peer}
              aspectRatio={{ width: 1, height: 1 }}
              showAudioMuteStatus={true}
              allowRemoteMute={true}
              isLocal={cameraStream.isLocal}
              //maxTileCount={9}
            />
          )}
        </div>

        {isChatOpen && (
          <div className="w-full h-2/3 pt-3 transition-height duration-500 ease-in-out">
            <ChatBox
              messages={messages}
              onSend={sendMessage}
              onClose={toggleChat}
            />
          </div>
        )}
      </>
    );
  } else if (streamsWithInfo.length == 1) {
    return (
      <>
        <div
          className={`w-full p-1 ${
            isChatOpen ? "h-1/3" : "h-1/2"
          } transition-height duration-500 ease-in-out`}
        >
          {cameraStream && (
            <VideoTile
              audioTrack={cameraStream.audioTrack}
              videoTrack={cameraStream.videoTrack}
              peer={cameraStream.peer}
              aspectRatio={{ width: 1, height: 1 }}
              showAudioMuteStatus={true}
              allowRemoteMute={true}
              isLocal={cameraStream.isLocal}
              //maxTileCount={9}
            />
          )}
        </div>
        <div
          className={`w-full  p-1 ${
            isChatOpen ? "h-2/3" : "h-1/2"
          } transition-height duration-200 ease-in-out`}
        >
          {isChatOpen ? (
            <ChatBox
              messages={messages}
              onSend={sendMessage}
              onClose={toggleChat}
            />
          ) : (
            streamsWithInfo &&
            streamsWithInfo.length > 0 && (
              <VideoList
                streams={streamsWithInfo}
                classes={{
                  videoTileParent: "rounded-lg",
                }}
                showAudioMuteStatus={true}
                allowRemoteMute={true}
                maxColCount={1}
              />
            )
          )}
        </div>
      </>
    );
  } else
    return (
      <>
        <div className="w-full h-1/3">
          {cameraStream && (
            <VideoTile
              audioTrack={cameraStream.audioTrack}
              videoTrack={cameraStream.videoTrack}
              peer={cameraStream.peer}
              aspectRatio={{ width: 1, height: 1 }}
              showAudioMuteStatus={true}
              allowRemoteMute={true}
              isLocal={cameraStream.isLocal}
              //maxTileCount={9}
            />
          )}
        </div>
        <div className="w-full h-2/3 pt-3">
          {isChatOpen ? (
            <ChatBox
              messages={messages}
              onSend={sendMessage}
              onClose={toggleChat}
            />
          ) : (
            streamsWithInfo &&
            streamsWithInfo.length > 0 && (
              <VideoList
                streams={streamsWithInfo}
                classes={{
                  videoTileParent: "rounded-lg px-1",
                }}
                showAudioMuteStatus={true}
                allowRemoteMute={true}
                maxColCount={2}
              />
            )
          )}
        </div>
      </>
    );
};

export const ScreenShareView = () => {
  const { isChatOpen, toggleChat } = useContext(AppContext);
  const { peers, messages, sendMessage } = useHMSRoom();
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
      setScreenStream(HMSPeerToScreenStreamWitnInfo(screenSharingPeer));
      setCameraStream(HMSPeertoCamerStreamWithInfo(screenSharingPeer));
    } else {
      setCameraStream(null);
      setScreenStream(null);
    }
    const videoStreamsWithInfo = remPeers
      .filter((peer) => Boolean(peer.videoTrack || peer.audioTrack))
      .map(HMSPeertoCamerStreamWithInfo);
    console.debug("app: Computed camera streams info ", videoStreamsWithInfo);

    const screenShareStreamsWithInfo = remPeers
      .filter(isScreenSharing)
      .map(HMSPeerToScreenStreamWitnInfo);

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
          {screenStream && (
            <VideoTile
              audioTrack={screenStream.audioTrack}
              videoTrack={screenStream.videoTrack}
              peer={screenStream.peer}
              videoSource="screen"
              aspectRatio={{ width: 16, height: 9 }}
              showAudioMuteStatus={true}
              allowRemoteMute={true}
              isLocal={screenStream.isLocal}
              objectFit="contain"
              //maxTileCount={9}
            />
          )}
        </div>

        <div className="flex flex-wrap overflow-hidden p-2 w-2/10 h-full ">
          {TransformVideoTileSizes(
            streamsWithInfo,
            isChatOpen,
            cameraStream,
            toggleChat
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
