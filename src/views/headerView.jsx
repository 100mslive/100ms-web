import {
  Header,
  ParticipantList,
  useHMSStore,
  VolumeIcon,
  selectDominantSpeakerName,
} from "@100mslive/sdk-components";
import React from "react";

const SpeakerTag = () => {
  const dominantSpeaker = useHMSStore(selectDominantSpeakerName);
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

export const ConferenceHeader = () => {
  return (
    <>
      <Header
        centerComponents={[<SpeakerTag key={0} />]}
        rightComponents={[<ParticipantList key={0} />]}
        classes={{ root: "h-16" }}
      />
    </>
  );
};
