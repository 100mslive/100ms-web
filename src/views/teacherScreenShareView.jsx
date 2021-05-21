import {
  useHMSRoom,
  VideoList,
  VideoTile,
  audioLevelEmitter,
} from "@100mslive/sdk-components";
import React from "react";
import { getStreamsInfo, isTeacher } from "../utlis/index";
import { ChatView } from "./chatView";

const SidePane = ({
  showCameraStream,
  streamsWithInfo,
  isChatOpen,
  cameraStream,
  toggleChat,
}) => {
  return (
    <>
      <div className={`w-full h-full relative`}>
        <div className={`w-full flex flex-col h-full`}>
          <div
            className="w-full relative overflow-hidden"
            style={{
              paddingTop: `${cameraStream && showCameraStream ? "100%" : "0"}`,
            }}
          >
            {cameraStream && showCameraStream && (
              <div className="absolute left-0 top-0 w-full h-full p-3">
                <VideoTile
                  audioTrack={cameraStream.audioTrack}
                  hmsVideoTrack={cameraStream.hmsVideoTrack}
                  videoTrack={cameraStream.videoTrack}
                  peer={cameraStream.peer}
                  showAudioMuteStatus
                  allowRemoteMute
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
                  audioLevelEmitter={audioLevelEmitter}
                />
              </div>
            )}
          </div>
          <div className={`w-full relative ${isChatOpen ? "h-1/3" : "h-full"}`}>
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
                allowRemoteMute
                maxColCount={2}
                overflow="scroll-x"
                audioLevelEmitter={audioLevelEmitter}
              />
            )}
          </div>
        </div>
        {isChatOpen && (
          <div className="h-2/3 w-full absolute z-40 bottom-0 right-0">
            <ChatView toggleChat={toggleChat} />
          </div>
        )}
      </div>
    </>
  );
};

export const TeacherScreenShareView = ({ isChatOpen, toggleChat }) => {
  const { peers } = useHMSRoom();
  const getLocalPeerID = (peers) => {
    for (let peer of peers) {
      if (peer.isLocal) return peer.peerId;
    }
  };
  const { streamsWithInfo, screenStream, cameraStream } = getStreamsInfo({
    peers,
  });
  let showCameraStream = cameraStream.role === "Student";
  if (!showCameraStream) streamsWithInfo.unshift(cameraStream);

  if (cameraStream.peer.id === getLocalPeerID(peers)) {
    showCameraStream = false;
    streamsWithInfo.push(cameraStream);
  }
  return (
    <React.Fragment>
      <div className="w-full h-full flex">
        <div className="w-8/10 h-full">
          {screenStream &&
            screenStream.videoTrack &&
            screenStream.hmsVideoTrack && (
              <VideoTile
                audioTrack={screenStream.audioTrack}
                hmsVideoTrack={screenStream.hmsVideoTrack}
                videoTrack={screenStream.videoTrack}
                peer={screenStream.peer}
                videoSource="screen"
                showAudioMuteStatus={false}
                allowRemoteMute={false}
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
          <SidePane
            showCameraStream={showCameraStream}
            streamsWithInfo={streamsWithInfo}
            isChatOpen={isChatOpen}
            cameraStream={cameraStream}
            toggleChat={toggleChat}
          />
        </div>
      </div>
    </React.Fragment>
  );
};
