import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../store/AppContext";
import { Header, ControlBar, ParticipantList } from "@100mslive/sdk-components";
import { ScreenShareView } from "../views/screenShareView";
import { TeacherView } from "../views/teacherView";
import { useHistory } from "react-router-dom";
import { useHMSRoom } from "@100mslive/sdk-components";
import { isScreenSharing } from "../utlis/index";
import {VolumeIcon} from "@100mslive/sdk-components"

const SpeakerTag = ({ name }) => {
  return name ? (
    <div className={`self-center focus:outline-none text-lg text-white`}>
      <div className="inline-block">
        {/* <VolumeIcon /> */}
      </div>
      {/* TODO figure out why xs:hidden is needed */}
      <div className="md:pl-2 xs:hidden md:inline-block">{name}</div>
    </div>
  ) : (
    <></>
  );
};
export const Conference = () => {
  const history = useHistory();
  const context = useContext(AppContext);

  const {
    loginInfo,
    isChatOpen,
    toggleChat,
    isConnected,
    maxTileCount,
    setMaxTileCount,
    leave,
  } = context;

  const {
    toggleMute,
    toggleScreenShare,
    peers,
    audioMuted,
    videoMuted,
    dominantSpeaker,
  } = useHMSRoom();
  const [participants, setParticipants] = useState([]);

  if (!loginInfo.token) {
    history.push("/");
  }
  useEffect(() => {
    return () => {
      leave();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setParticipants(
      peers && peers.length > 0 && peers[0]
        ? peers.map((participant) => {
            console.debug("app: Participant is ", participant);
            return {
              peer: {
                displayName: participant.name,
                id: participant.id,
                role: participant.role,
              },
            };
          })
        : []
    );
  }, [peers]);

  return (
    <div className="w-full h-full dark:bg-black">
      <div style={{ padding: "25px", height: "10%" }}>
        <Header
          centerComponents={[
            <SpeakerTag
              name={dominantSpeaker && dominantSpeaker.name}
              key={0}
            />,
          ]}
          rightComponents={[
            <ParticipantList key={0} participantList={participants} />,
          ]}
        />
      </div>
      <div className="w-full flex" style={{ height: "80%" }}>
        {peers.some(isScreenSharing) ? <ScreenShareView /> : <TeacherView />}
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
      <div className="dark:bg-black" style={{ height: "10%" }}>
        {isConnected && (
          <ControlBar
            maxTileCount={maxTileCount}
            setMaxTileCount={setMaxTileCount}
            audioButtonOnClick={() => toggleMute("audio")}
            videoButtonOnClick={() => toggleMute("video")}
            leaveButtonOnClick={() => {
              leave();
              history.push("/");
            }}
            screenshareButtonOnClick={() => toggleScreenShare()}
            isAudioMuted={audioMuted}
            isVideoMuted={videoMuted}
            isChatOpen={isChatOpen}
            chatButtonOnClick={() => {
              toggleChat();
            }}
          />
        )}
      </div>
    </div>
  );
};
