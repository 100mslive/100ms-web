import React, { useEffect, useState } from "react";
import HMSSdk from "@100mslive/100ms-web-sdk";
import { AppContext } from "../store/AppContext";
import { Header, ControlBar } from "@100mslive/sdk-components";
import { TeacherView } from "../views/teacherView";
import { StudentView } from "../views/studentView";
import { useHistory } from "react-router-dom";

export const Conference = ({ streams, loginInfo, sdk }) => {
  const history = useHistory();

  //time when user enters room
  const [startTime, setStartTime] = useState(new Date());
  //current time to triger rendering
  const [currentTime, setTime] = useState(startTime);

  if (!loginInfo.token || !sdk || !sdk.getLocalPeer()) {
    history.push("/");
    //return;
  }

  //just to update time on header
  useEffect(() => {
    let interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
      sdk.leave();
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
        {sdk && (
          <ControlBar
            audioButtonOnClick={() => {
              let peer = sdk.getLocalPeer();
              console.log(peer);
              const isAudioEnabled =
                sdk.getLocalPeer().audioTrack &&
                sdk.getLocalPeer().audioTrack.enabled;
              peer.audioTrack.setEnabled(!isAudioEnabled);
            }}
            videoButtonOnClick={() => {
              let peer = sdk.getLocalPeer();
              const isVideoEnabled =
                sdk.getLocalPeer().videoTrack &&
                sdk.getLocalPeer().videoTrack.enabled;
              peer.videoTrack.setEnabled(!isVideoEnabled);
            }}
            leaveButtonOnClick={() => {
              sdk.leave();
              history.push("/");
            }}
            isAudioMuted={
              !(
                sdk.getLocalPeer().audioTrack &&
                sdk.getLocalPeer().audioTrack.enabled
              )
            }
            isVideoMuted={
              !(
                sdk.getLocalPeer().videoTrack &&
                sdk.getLocalPeer().videoTrack.enabled
              )
            }
          />
        )}
      </div>
    </div>
  );
};
