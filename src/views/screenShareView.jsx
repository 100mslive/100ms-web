import React, { useEffect, useState, useContext } from "react";
import { VideoList, ChatBox, VideoTile } from "@100mslive/sdk-components";
import { useHMSRoom } from "@100mslive/sdk-components";
import { AppContext } from "../store/AppContext";
import {
  HMSPeerToScreenStreamWitnInfo,
  HMSPeertoCamerStreamWithInfo,
  isScreenSharing,
} from "../utlis/index";

export const ScreenShareView = () => {
  const { isChatOpen, toggleChat } = useContext(AppContext);
  const { peers } = useHMSRoom();
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
    if (index !== -1) remPeers.splice(index, 1);
    console.log("screen shared by", screenSharingPeer);
    setScreenStream(HMSPeerToScreenStreamWitnInfo(screenSharingPeer));
    setCameraStream(HMSPeertoCamerStreamWithInfo(screenSharingPeer));
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
              //maxTileCount={9}
            />
          )}
        </div>

        <div className="flex flex-wrap p-2 w-2/10 h-full">
          <div className="w-full h-1/3">
            {cameraStream && (
              <VideoTile
                audioTrack={cameraStream.audioTrack}
                videoTrack={cameraStream.videoTrack}
                peer={cameraStream.peer}
                aspectRatio={{ width: 1, height: 1 }}
                showAudioMuteStatus={true}
                allowRemoteMute={true}
                //maxTileCount={9}
              />
            )}
          </div>
          <div className="w-full h-2/3 pt-3">
            {isChatOpen ? (
              <ChatBox
                messages={[]}
                onSend={(message) => {}}
                onClose={toggleChat}
              />
            ) : (
              streamsWithInfo &&
              streamsWithInfo.length > 0 && (
                <VideoList
                  streams={streamsWithInfo}
                  classes={{
                    videoTileParent: " p-1 rounded-lg",
                  }}
                  showAudioMuteStatus={true}
                  allowRemoteMute={true}
                  maxColCount={2}
                />
              )
            )}
          </div>
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
