import React, { useEffect, useState } from "react";
import { Header, VideoList, VideoTile } from "@100mslive/sdk-components";
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
          // @ts-ignore
          //window.stream = stream;
          setCameraStream(stream);
          console.log(stream, "got it");
        });
    }
    if (isScreenStreamRequired) {
      window.navigator.mediaDevices
        // @ts-ignore
        .getDisplayMedia({ video: true })
        .then(function (stream) {
          // @ts-ignore
          //window.stream = stream;
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
    <div className="w-full h-full">
      {/* {cameraStream && (
          <VideoTile
            stream={cameraStream}
            peer={{ id: "123", displayName: "Eswar" }}
          />
        )} */}
      {
        <VideoList
          streams={[
            {
              stream: cameraStream,
              peer: { id: "123", displayName: "Nikhil1" },
              videoSource: "camera",
              audioLevel: 50,
            },
            {
              stream: cameraStream,
              peer: { id: "123", displayName: "Nikhil1" },
              videoSource: "camera",
              audioLevel: 50,
            },
          ]}
          maxTileCount={2}
        />
      }
    </div>
  );
};
