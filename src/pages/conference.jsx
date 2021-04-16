import React, { useEffect, useState } from "react";
import HMSSdk from "@100mslive/100ms-web-sdk";
import { AppContext } from "../store/AppContext";
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

async function getToken() {
  const response = await fetch("https://100ms-services.vercel.app/api/token", {
    method: "POST",
    body: JSON.stringify({
      env: "qa-in",
      role: "Guest",
      room_id: "6077d5e1dcee704ca43caea3",
      user_name: "Edla",
    }),
  });

  const { token } = await response.json();
  return token;
}

export const Conference = ({ streamsWithInfo }) => {
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    const sdk = new HMSSdk();

    getToken().then((token) => {
      const config = {
        userName: "Edla",
        authToken: token,
        metaData: "Hail Hydra!",
      };
      const listener = {
        onJoin: (room) => {
          console.log(`[APP]: Joined room`, room);
        },

        onRoomUpdate: (type, room) => {
          console.log(
            `[APP]: onRoomUpdate with type ${type} and ${JSON.stringify(
              room,
              null,
              2
            )}`
          );
        },

        onPeerUpdate: (type, peer) => {
          console.log(`[APP]: onPeerUpdate with type ${type} and ${peer}`);
        },

        onTrackUpdate: (type, track) => {
          console.log(`[APP]: onTrackUpdate with type ${type}`, track);
          setStreams((prev) => {
            console.log({ prev });
            const newStreams = sdk
              .getPeers()
              .filter((peer) => Boolean(peer.videoTrack))
              .map((peer) => {
                console.log("PEER", peer);
                return {
                  stream: peer.videoTrack.stream.nativeStream,
                  peer: {
                    id: peer.peerId,
                    displayName: peer.name || peer.peerId,
                  },
                  videoSource: "camera",
                  audioLevel: 0,
                  isLocal: peer.isLocal,
                };
              });
            return newStreams;
          });
        },

        onError: (error) => {
          console.log("ERROR", error);
        },
      };

      sdk.join(config, listener);
    });

    window.onunload = function () {
      alert("leaving");
      sdk.leave();
    };
  }, []);

  console.log(streams) // use this instead of streamsWithInfo

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
                stream: !item.isVideoMuted
                  ? item.videoSource == "screen"
                    ? screenStream
                    : cameraStream
                  : new MediaStream(),
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
                stream: !item.isVideoMuted
                  ? item.videoSource == "screen"
                    ? screenStream
                    : cameraStream
                  : new MediaStream(),
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
