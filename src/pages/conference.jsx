import React, { useEffect, useState } from "react";
import HMSSdk from "@100mslive/100ms-web-sdk";
import { AppContext } from "../store/AppContext";
import { Header, ControlBar } from "@100mslive/sdk-components";
import { TeacherView } from "../views/teacherView";
import { StudentView } from "../views/studentView";
import { useHistory } from "react-router-dom";

export const Conference = ({ streams, loginInfo }) => {
  const history = useHistory();
  //time when user enters room
  const [startTime, setStartTime] = useState(new Date());
  //current time to triger rendering
  const [currentTime, setTime] = useState(startTime);

  if (!loginInfo.token) {
    history.push("/");
  }

  //just to update time on header
  useEffect(() => {
    let interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="w-full h-full bg-black">
      <div style={{ height: "10%" }}>
        <Header
          peer={{ displayName: loginInfo.username }}
          time={Math.floor((currentTime - startTime) / 1000)}
        />
      </div>
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
