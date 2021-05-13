import {
  Button,
  ControlBar,
  HangUpIcon,
  Header,
  ParticipantList,
  useHMSRoom,
  useHMSSpeaker,
  VolumeIcon,
} from "@100mslive/sdk-components";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { AppContext } from "../store/AppContext";
import { isScreenSharing } from "../utlis/index";
import { ScreenShareView } from "../views/screenShareView";
import { TeacherView } from "../views/teacherView";

const SpeakerTag = ({ name }) => {
  return name ? (
    <div
      className={`self-center focus:outline-none text-lg text-white flex items-center`}
    >
      <div className="inline-block">
        <VolumeIcon />
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
  const { roomId: urlRoomId } = useParams();
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

  const { toggleMute, toggleScreenShare, peers, audioMuted, videoMuted } =
    useHMSRoom();
  const { dominantSpeaker } = useHMSSpeaker();
  const [participants, setParticipants] = useState([]);

  if (!loginInfo.token) {
    history.push(`/${loginInfo.roomId || urlRoomId || ""}`);
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
      <div style={{ height: "10%" }}>
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
          classes={{ root: "h-16" }}
        />
      </div>
      <div className="w-full flex" style={{ height: "80%" }}>
        {peers.some(isScreenSharing) ? <ScreenShareView /> : <TeacherView />}
      </div>
      <div className="dark:bg-black" style={{ height: "10%" }}>
        {isConnected && (
          <ControlBar
            rightComponents={[
              <Button
                shape="rectangle"
                variant={"danger"}
                onClick={() => {
                  leave();
                  history.push("/");
                }}
                size="lg"
              >
                <HangUpIcon className="mr-2" />
                Leave room
              </Button>,
            ]}
            maxTileCount={maxTileCount}
            setMaxTileCount={setMaxTileCount}
            audioButtonOnClick={() => toggleMute("audio")}
            videoButtonOnClick={() => toggleMute("video")}
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
