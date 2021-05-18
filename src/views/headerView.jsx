import {
  Header,
  ParticipantList,
  useHMSRoom,
  useHMSSpeaker,
  VolumeIcon,
} from "@100mslive/sdk-components";
import React from "react";

const SpeakerTag = () => {
  const { dominantSpeaker } = useHMSSpeaker();
  return dominantSpeaker && dominantSpeaker.name ? (
    <div
      className={`self-center focus:outline-none text-lg flex items-center`}
    >
      <div className="inline-block">
        <VolumeIcon />
      </div>
      {/* TODO figure out why xs:hidden is needed */}
      <div className="md:pl-1 xs:hidden md:inline-block">
        {dominantSpeaker.name}
      </div>
    </div>
  ) : (
    <></>
  );
};

const Participants = () => {
  const { peers } = useHMSRoom();
  const participants =
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
      : [];

  return (
    <>
      {participants !== undefined && participants.length && (
        <ParticipantList participantList={participants} />
      )}
    </>
  );
};

export const ConferenceHeader = () => {
  return (
    <>
      <Header
        centerComponents={[<SpeakerTag key={0} />]}
        rightComponents={[<Participants key={0} />]}
        classes={{ root: "h-16" }}
      />
    </>
  );
};
