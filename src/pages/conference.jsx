import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../store/AppContext";
import { Header, ControlBar } from "@100mslive/sdk-components";
import { TeacherView } from "../views/teacherView";
import { StudentView } from "../views/studentView";
import { useHistory } from "react-router-dom";
import { useHMSRoom } from '@100mslive/sdk-components';

export const Conference = () => {
  const history = useHistory();
  const context = useContext(AppContext);
  const { loginInfo } = context;

  const { leave, localPeer, toggleMute } = useHMSRoom();

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
        <TeacherView />
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
            toggleMute(localPeer.audioTrack);
          }}
          videoButtonOnClick={() => {
            toggleMute(localPeer.videoTrack);
          }}
          leaveButtonOnClick={() => {
            leave();
            history.push("/");
          }}
          isAudioMuted={localPeer &&
            !(
              localPeer.audioTrack &&
              localPeer.audioTrack.enabled
            )
          }
          isVideoMuted={localPeer &&
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
