import React from "react";
import {
  Header,
  VideoList,
  VideoTile,
  ControlBar,
} from "@100mslive/sdk-components";
export const StudentView = ({ streamsWithInfo }) => {
  return (
    <React.Fragment>
      <div className=" h-full  " style={{ width: "75%" }}>
        <VideoList
          streams={streamsWithInfo.filter((peer) => peer.role === "Teacher")}
          classes={{
            root: "",
            videoTileParent: " p-6 rounded-xl",
            video: "rounded-xl",
          }}
        />
      </div>
      <div className=" p-6" style={{ width: "25%" }}>
        <VideoList
          streams={streamsWithInfo.filter((peer) => peer.role === "Student")}
          classes={{
            videoTileParent: "p-3 rounded-xl",
            video: "rounded-xl",
          }}
          overflow="scroll-x"
          maxTileCount={8}
        />
      </div>
    </React.Fragment>
  );
};
