import {
  Header,
  ParticipantList,
  useHMSStore,
  VolumeIcon,
  selectDominantPeer,
  selectPeersWithMuteStatus,
} from "@100mslive/sdk-components";
import React from "react";

const SpeakerTag = () => {
  const dominantSpeaker = useHMSStore(selectDominantPeer);
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
  const participants = useHMSStore(selectPeersWithMuteStatus);
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
