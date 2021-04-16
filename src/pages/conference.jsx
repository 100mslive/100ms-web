import React, { useEffect, useState } from "react";
import {
  Header,
  VideoList,
  VideoTile,
  ControlBar,
} from "@100mslive/sdk-components";
import { AppContext } from "../store/AppContext";
import { TeacherView } from "../views/teacherView";
import { StudentView } from "../views/studentView";
const closeMediaStream = (stream) => {
  if (!stream) {
    return;
  }
  const tracks = stream.getTracks();
  tracks.forEach((track) => track.stop());
};

export const Conference = ({ streamsWithInfo, loginInfo }) => {
  const { role } = loginInfo;
  const isCameraStreamRequired = streamsWithInfo.some(
    (stream) => stream.videoSource === "camera"
  );
  const isScreenStreamRequired = streamsWithInfo.some(
    (stream) => stream.videoSource === "screen"
  );
  const [cameraStream, setCameraStream] = useState();
  const [screenStream, setScreenStream] = useState();

  useEffect(() => {
    closeMediaStream(cameraStream);
    closeMediaStream(screenStream);

    if (isCameraStreamRequired) {
      window.navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          setCameraStream(stream);
          console.log(stream, "got it");
        });
    }
    if (isScreenStreamRequired) {
      window.navigator.mediaDevices

        .getDisplayMedia({ video: true })
        .then(function (stream) {
          console.log(stream);
          setScreenStream(stream);
        });
    }

    return () => {
      closeMediaStream(screenStream);
      closeMediaStream(cameraStream);
    };
  }, [streamsWithInfo]);
  return (
    <div className="w-full h-full bg-black">
      <div style={{ height: "10%" }}>
        <Header />
      </div>
      <div className="w-full flex" style={{ height: "80%" }}>
        {role === "Teacher" ? (
          <TeacherView
            streamsWithInfo={streamsWithInfo
              .filter(
                (item) =>
                  item.videoSource == "screen" || item.videoSource == "camera"
              )
              .map((item) => ({
                ...item,
                stream:
                  item.videoSource == "screen" ? screenStream : cameraStream,
              }))}
          />
        ) : (
          <StudentView
            streamsWithInfo={streamsWithInfo
              .filter(
                (item) =>
                  item.videoSource == "screen" || item.videoSource == "camera"
              )
              .map((item) => ({
                ...item,
                stream:
                  item.videoSource == "screen" ? screenStream : cameraStream,
              }))}
          />
        )}
      </div>
      <div className="bg-black" style={{ height: "10%" }}>
        <ControlBar />
      </div>
    </div>
  );
};
