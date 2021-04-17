import React, { useEffect, useState } from "react";
import HMSSdk from "@100mslive/100ms-web-sdk";
import { AppContext } from "../store/AppContext";
import { Header, ControlBar } from "@100mslive/sdk-components";
import { TeacherView } from "../views/teacherView";
import { StudentView } from "../views/studentView";
import { useHistory } from "react-router-dom";

export const Conference = ({ streams, loginInfo }) => {
  const history = useHistory();
  if (!loginInfo.token) {
    history.push("/");
  }
  return (
    <div className="w-full h-full bg-black">
      <div style={{ height: "10%" }}>{/* <Header /> */}</div>
      <div className="w-full flex" style={{ height: "80%" }}>
        {streams && streams.length > 0 && (
          <TeacherView streamsWithInfo={streams} />
        )}
        {/* // ) : (
        //   <StudentView
        //     streamsWithInfo={streamsWithInfo
        //       .filter(
        //         (item) =>
        //           item.videoSource == "screen" || item.videoSource == "camera"
        //       )
        //       .map((item) => ({
        //         ...item,
        //         stream: !item.isVideoMuted
        //           ? item.videoSource == "screen"
        //             ? screenStream
        //             : cameraStream
        //           : new MediaStream(),
        //       }))}
        //   />
        // )} */}
      </div>
      <div className="bg-black" style={{ height: "10%" }}>
        <ControlBar
          audioButtonOnClick={() => {
            alert("audio toggle here");
          }}
          videoButtonOnClick={() => {
            alert("video toggle here");
          }}
          leaveButtonOnClick={() => {
            alert("left room");
          }}
        />
      </div>
    </div>
  );
};
