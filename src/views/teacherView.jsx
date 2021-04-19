import React from "react";
import { VideoList } from "@100mslive/sdk-components";
export const TeacherView = ({ streamsWithInfo }) => {
  return (
    <React.Fragment>
      <div className="w-full h-full ">
        <VideoList
          streams={streamsWithInfo}
          classes={{
            root: "",
            videoTileParent: " p-4 rounded-lg",
            //video: "rounded-3xl",
          }}
          showAudioMuteStatus={true}
          allowRemoteMute={true}
          //maxTileCount={9}
        />
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
