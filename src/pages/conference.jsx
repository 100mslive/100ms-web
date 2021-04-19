import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../store/AppContext";
import { Header, ControlBar, HMSContext, useHMSRoom } from "@100mslive/sdk-components";
import { TeacherView } from "../views/teacherView";
import { StudentView } from "../views/studentView";
import { useHistory } from "react-router-dom";

export const Conference = () => {
  const history = useHistory();
  const context = useContext(AppContext);
  const { streams, loginInfo } = context;

  const { join, leave, localPeer, peers, toggleMute } = useHMSRoom();

  //time when user enters room
  const [startTime, setStartTime] = useState(new Date());
  //current time to triger rendering
  const [currentTime, setTime] = useState(startTime);

  if (!loginInfo.token) {
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
      leave();
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
            let peer = localPeer;
            console.log(peer);
            const isAudioEnabled =
              peer.audioTrack &&
              peer.audioTrack.enabled;
            toggleMute(!isAudioEnabled);
          }}
          videoButtonOnClick={() => {
            let peer = localPeer;
            const isVideoEnabled =
              peer.videoTrack &&
              peer.videoTrack.enabled;
            toggleMute(!isVideoEnabled);
          }}
          leaveButtonOnClick={() => {
            leave();
            history.push("/");
          }}
          isAudioMuted={
            !(
              localPeer.audioTrack &&
              localPeer.audioTrack.enabled
            )
          }
          isVideoMuted={
            !(
              localPeer.videoTrack &&
              localPeer.videoTrack.enabled
            )
          }
        />
      </div>
    </div>
  );
};
