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
  selectPeerSharingAudioPlaylist,
  selectAudioPlaylistTrackByPeerID,
  useHMSActions,
  RecordingDot,
  GlobeIcon,
  selectRecordingState,
  selectRTMPState,
} from "@100mslive/hms-video-react";
import PIPComponent from "./PIP/PIPComponent";

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
  // Don't show mute option if remote peer has disabled
  if (!peer.isLocal && !track.enabled) {
    return null;
  }
  const muted = peer.isLocal ? !track.enabled : track.volume === 0;

  const handleMute = () => {
    if (!peer.isLocal) {
      hmsActions.setVolume(!track.volume ? 100 : 0, track.id);
    } else {
      hmsActions.setEnabledTrack(track.id, !track.enabled).catch(console.error);
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

const PlaylistMusic = () => {
  const hmsActions = useHMSActions();
  const peer = useHMSStore(selectPeerSharingAudioPlaylist);
  const track = useHMSStore(selectAudioPlaylistTrackByPeerID(peer?.id));

  if (!peer || !track) {
    return null;
  }
  // Don't show mute option if remote peer has disabled
  if (!peer.isLocal && !track.enabled) {
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
        Playlist is playing
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

const Recording = () => {
  const recording = useHMSStore(selectRecordingState);
  const rtmp = useHMSStore(selectRTMPState);

  if (
    !recording.browser.running &&
    !recording.server.running &&
    !rtmp.running
  ) {
    return null;
  }

  const isRecordingOn = recording.browser.running || recording.server.running;
  const getText = () => {
    if (!isRecordingOn) {
      return "";
    }
    let title = "";
    if (recording.browser.running) {
      title += "Browser Recording: on";
    }
    if (recording.server.running) {
      if (title) {
        title += "\n";
      }
      title += "Server Recording: on";
    }
    return title;
  };

  return (
    <div className="flex mx-2">
      {isRecordingOn && (
        <div className="flex items-center" title={getText()}>
          <RecordingDot
            className="fill-current text-red-600"
            width="20"
            height="20"
          />
          <Text variant="body" size="md" classes={{ root: "mx-1" }}>
            Recording
          </Text>
        </div>
      )}
      {rtmp.running && (
        <div className="flex items-center mx-2">
          <GlobeIcon className="fill-current text-red-600" />
          <Text variant="body" size="md" classes={{ root: "mx-1" }}>
            Streaming
          </Text>
        </div>
      )}
    </div>
  );
};

export const ConferenceHeader = ({ onParticipantListOpen }) => {
  return (
    <>
      <Header
        leftComponents={[
          <LogoButton key={0} />,
          <Music key={1} />,
          <PlaylistMusic key={2} />,
          <Recording key={3} />,
        ]}
        centerComponents={[<SpeakerTag key={0} />]}
        rightComponents={[
          <PIPComponent key={0} />,
          <ParticipantList key={1} onToggle={onParticipantListOpen} />,
        ]}
        classes={{ root: "h-full" }}
      />
    </>
  );
};
