import { VideoList, audioLevelEmitter } from "@100mslive/sdk-components";
import React from "react";
export const StudentView = ({ streamsWithInfo }) => {
  return (
    <React.Fragment>
      <div className=" h-full  " style={{ width: "75%" }}>
        <VideoList
          streams={streamsWithInfo.filter((peer) => peer.role === "Teacher")}
          classes={{
            root: "",
            videoTileContainer: " p-6 rounded-xl",
            video: "rounded-xl",
          }}
          showAudioMuteStatus={true}
          allowRemoteMute={false}
          audioLevelEmitter={audioLevelEmitter}
        />
      </div>
      <div className=" p-6" style={{ width: "25%" }}>
        <VideoList
          streams={streamsWithInfo.filter((peer) => peer.role === "Student")}
          classes={{
            videoTileContainer: "p-3 rounded-xl",
            video: "rounded-xl",
          }}
          overflow="scroll-x"
          maxTileCount={8}
          showAudioMuteStatus={true}
          allowRemoteMute={false}
          audioLevelEmitter={audioLevelEmitter}
        />
      </div>
    </React.Fragment>
  );
};
