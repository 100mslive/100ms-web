import {
  Header,
  ParticipantList,
  useHMSStore,
  VolumeIcon,
  LogoButton,
  Text,
  selectDominantSpeaker,
  selectPeerSharingAudio,
  selectScreenShareAudioByPeerID,
  useHMSActions,
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

const Music = () => {
  const hmsActions = useHMSActions();
  const peer = useHMSStore(selectPeerSharingAudio);
  const track = useHMSStore(selectScreenShareAudioByPeerID(peer?.id));
  if (!peer || !track) {
    return null;
  }
  const muted = peer.isLocal ? !track.enabled : track.volume === 0;

  const handleMute = () => {
    if (!peer.isLocal) {
      hmsActions.setVolume(!track.volume ? 100 : 0, track.id);
    } else {
      hmsActions.setEnabledTrack(track.id, !track.enabled);
    }
  };

  return (
    <div className="flex items-center">
      <VolumeIcon />
      <Text variant="body" size="md" classes={{ root: "mx-2" }}>
        Music is playing
      </Text>
      <Text
        variant="body"
        size="md"
        onClick={handleMute}
        classes={{ root: "text-red-tint cursor-pointer" }}
      >
        {muted ? "Unmute" : "Mute"}
      </Text>
    </div>
  );
};

export const ConferenceHeader = ({ onParticipantListOpen }) => {
  return (
    <>
      <Header
        leftComponents={[<LogoButton key={0} />, <Music key={1} />]}
        centerComponents={[<SpeakerTag key={0} />]}
        rightComponents={[
          <ParticipantList key={0} onToggle={onParticipantListOpen} />,
        ]}
        classes={{ root: "h-full" }}
      />
    </>
  );
};
