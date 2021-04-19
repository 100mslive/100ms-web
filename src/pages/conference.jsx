import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../store/AppContext";
import { Header, ControlBar } from "@100mslive/sdk-components";
import { TeacherView } from "../views/teacherView";
import { useHistory } from "react-router-dom";

export const Conference = () => {
  const history = useHistory();
  const {
    streams,
    loginInfo,
    sdk,
    addVideoTrack,
    removeVideoTrack,
  } = useContext(AppContext);

  const [isScreenShareEnabled, setScreenShareEnabled] = useState(false);
  const [isAudioEnabled, setAudioEnabled] = useState(true);
  const [isVideoEnabled, setVideoEnabled] = useState(true);

  if (!loginInfo.token) {
    history.push("/");
  }
  useEffect(() => {
    console.log("sdk changed");
  }, [sdk]);

  return (
    <div className="w-full h-full bg-black">
      <div style={{ height: "10%" }}>
        <Header />
      </div>
      <div className="w-full flex" style={{ height: "80%" }}>
        {streams && streams.length > 0 && (
          <TeacherView streamsWithInfo={streams} />
        )}
      </div>
      <div className="bg-black" style={{ height: "10%" }}>
        {sdk && (
          <ControlBar
            audioButtonOnClick={() => {
              let peer = sdk.getLocalPeer();

              setAudioEnabled((isAudioEnabled) => {
                peer.audioTrack.setEnabled(!isAudioEnabled);
                return !isAudioEnabled;
              });
            }}
            videoButtonOnClick={() => {
              let peer = sdk.getLocalPeer();
              setVideoEnabled((isVideoEnabled) => {
                peer.videoTrack.setEnabled(!isVideoEnabled);
                return !isVideoEnabled;
              });
            }}
            leaveButtonOnClick={() => {
              sdk.leave();
              history.push("/");
            }}
            screenshareButtonOnClick={async () => {
              if (!isScreenShareEnabled) {
                await sdk.startScreenShare(async () => {
                  setScreenShareEnabled(false);
                  let screenShare = sdk.getLocalPeer().auxiliaryTracks[0];
                  removeVideoTrack(screenShare, sdk.getLocalPeer());
                  await sdk.stopScreenShare();
                });
                let screenShare = sdk.getLocalPeer().auxiliaryTracks[0];
                addVideoTrack(screenShare, sdk.getLocalPeer());
              } else {
                let screenShare = sdk.getLocalPeer().auxiliaryTracks[0];
                removeVideoTrack(screenShare, sdk.getLocalPeer());
                await sdk.stopScreenShare();
              }
              setScreenShareEnabled((prevState) => !prevState);
            }}
            isAudioMuted={!isAudioEnabled}
            isVideoMuted={!isVideoEnabled}
          />
        )}
      </div>
    </div>
  );
};
