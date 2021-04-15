import React, { useEffect, useState } from "react";
import {
  Header,
  VideoList,
  VideoTile,
  ControlBar,
} from "@100mslive/sdk-components";
import { AppContext } from "../store/AppContext";

const closeMediaStream = (stream) => {
  if (!stream) {
    return;
  }
  const tracks = stream.getTracks();
  tracks.forEach((track) => track.stop());
};

export const Conference = ({ streamsWithInfo }) => {
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
      <div className="">
        <Header />
      </div>
      <div className="w-full h-5/6 flex">
        <div className="w-5/6 h-full m-1 ">
          <VideoList
            streams={streamsWithInfo
              .filter(
                (item) =>
                  (item.videoSource == "screen" ||
                    item.videoSource == "camera") &&
                  item.role === "Student"
              )
              .map((item) => ({
                ...item,
                stream:
                  item.videoSource == "screen" ? screenStream : cameraStream,
              }))}
            classes={{
              root: "",
              videoTileParent: "rounded-xl p-6",
              video: "rounded-xl",
            }}
          />
        </div>
        <div className="w-80">
          <VideoList
            streams={streamsWithInfo
              .filter(
                (item) =>
                  (item.videoSource == "screen" ||
                    item.videoSource == "camera") &&
                  item.role === "Teacher"
              )
              .map((item) => ({
                ...item,
                stream:
                  item.videoSource == "screen" ? screenStream : cameraStream,
              }))}
            classes={{
              videoTileParent: "m-2 rounded-xl",
              video: "rounded-xl",
            }}
            overflow="scroll-x"
            maxColCount={3}
          />
        </div>
      </div>
      <div className="bg-black">
        <ControlBar />
      </div>
    </div>
  );
};
