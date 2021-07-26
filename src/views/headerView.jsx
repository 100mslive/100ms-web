import {
  Header,
  ParticipantList,
  useHMSStore,
  VolumeIcon,
  Text,
  selectDominantSpeaker,
} from "@100mslive/hms-video-react";
import React from "react";

const SpeakerTag = () => {
  const dominantSpeaker = useHMSStore(selectDominantSpeaker);
  return dominantSpeaker && dominantSpeaker.name ? (
    <div className="self-center focus:outline-none text-lg flex items-center">
      <VolumeIcon />
      <Text
        variant="body"
        size="md"
        classes={{ root: "truncate max-w-xs ml-1 flex-1" }}
        title={dominantSpeaker.name}
      >
        {dominantSpeaker.name}
      </Text>
    </div>
  ) : (
    <></>
  );
};

export const ConferenceHeader = ({ onParticipantListOpen }) => {
  return (
    <>
      <Header
        centerComponents={[<SpeakerTag key={0} />]}
        rightComponents={[
          <ParticipantList key={0} onToggle={onParticipantListOpen} />,
        ]}
        classes={{ root: "h-full" }}
      />
    </>
  );
};
