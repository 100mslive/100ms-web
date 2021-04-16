import React from "react";
import {
  Header,
  VideoList,
  VideoTile,
  ControlBar,
} from "@100mslive/sdk-components";
export const TeacherView = ({ streamsWithInfo }) => {
  return (
    <React.Fragment>
      <div className="w-2/3 h-full  ">
        <VideoList
          streams={streamsWithInfo.filter((peer) => peer.role === "Student")}
          classes={{
            root: "",
            videoTileParent: " p-6 rounded-xl",
            video: "rounded-xl",
          }}
        />
      </div>
      <div className="w-1/3 p-6">
        <VideoList
          streams={streamsWithInfo.filter((peer) => peer.role === "Teacher")}
          classes={{
            videoTileParent: "p-5 rounded-xl",
            video: "rounded-xl",
          }}
          overflow="scroll-x"
          maxTileCount={4}
        />
      </div>
    </React.Fragment>
  );
};
