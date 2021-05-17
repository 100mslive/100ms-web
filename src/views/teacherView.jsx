import {
  useHMSRoom,
  VideoList,
  audioLevelEmitter,
} from "@100mslive/sdk-components";
import React, { useContext } from "react";
import { AppContext } from "../store/AppContext";
import { HMSPeertoCameraStreamWithInfo } from "../utlis";
import { ChatView } from "./chatView";

export const TeacherView = ({ isChatOpen, toggleChat }) => {
  const { maxTileCount } = useContext(AppContext);
  const { peers } = useHMSRoom();
  const streamsWithInfo =
    peers && peers.length > 0 && peers[0]
      ? peers
          .filter((peer) => Boolean(peer.videoTrack || peer.audioTrack))
          .map((peer) => HMSPeertoCameraStreamWithInfo(peer))
      : [];

  return (
    <React.Fragment>
      <div className="w-full h-full flex">
        <div className={isChatOpen ? "w-8/10 h-full" : "w-full h-full"}>
          {streamsWithInfo && streamsWithInfo.length > 0 && (
            <VideoList
              streams={streamsWithInfo}
              classes={{
                root: "",
                videoTileContainer: " p-4 rounded-lg",
                //video: "rounded-3xl",
              }}
              showAudioMuteStatus={true}
              allowRemoteMute={false}
              maxTileCount={maxTileCount}
              audioLevelEmitter={audioLevelEmitter}
            />
          )}
        </div>
        {isChatOpen && (
          <div className="flex items-end p-2 w-2/10 h-full">
            <div className="w-full h-5/6">
              <ChatView toggleChat={toggleChat}></ChatView>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
