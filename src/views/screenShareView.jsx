import {
  useHMSRoom,
  VideoList,
  VideoTile,
  audioLevelEmitter,
} from "@100mslive/sdk-components";
import React from "react";
import { getStreamsInfo } from "../utlis/index";
import { ChatView } from "./chatView";

const SidePane = ({
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
              paddingTop: `${cameraStream ? "100%" : "0"}`,
            }}
          >
            {cameraStream && (
              <div className="absolute left-0 top-0 w-full h-full p-3">
                <VideoTile
                  audioTrack={cameraStream.audioTrack}
                  hmsVideoTrack={cameraStream.hmsVideoTrack}
                  videoTrack={cameraStream.videoTrack}
                  peer={cameraStream.peer}
                  showAudioMuteStatus={true}
                  allowRemoteMute={false}
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
                allowRemoteMute={false}
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

export const ScreenShareView = ({ isChatOpen, toggleChat }) => {
  const { peers } = useHMSRoom();

  const { streamsWithInfo, screenStream, cameraStream } = getStreamsInfo({
    peers,
  });

  return (
    <React.Fragment>
      <div className="w-full h-full flex">
        <div className="w-8/10 h-full">
          {screenStream && screenStream.videoTrack && screenStream.hmsVideoTrack && (
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
