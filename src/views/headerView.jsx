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
  selectAudioPlaylist,
  selectHLSState,
  selectLocalPeer,
} from "@100mslive/hms-video-react";
import PIPComponent from "./PIP/PIPComponent";
import { AppContext } from "../store/AppContext";
import { metadataProps as participantInListProps } from "../common/utils";
import { useContext } from "react";

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
  const selection = useHMSStore(selectAudioPlaylist.selectedItem);

  if (!peer || !track) {
    return null;
  }
  // Don't show mute option if remote peer has disabled
  if (!peer.isLocal && !track.enabled) {
    return null;
  }

  if (peer.isLocal && !selection) {
    return null;
  }

  return (
    <div className="flex items-center">
      <VolumeIcon />
      <Text variant="body" size="md" classes={{ root: "mx-2" }}>
        Playlist is playing
      </Text>
      {peer.isLocal ? (
        <Text
          variant="body"
          size="md"
          onClick={async () => {
            if (selection.playing) {
              hmsActions.audioPlaylist.pause();
            } else {
              await hmsActions.audioPlaylist.play(selection.id);
            }
          }}
          classes={{ root: "text-red-tint cursor-pointer" }}
        >
          {selection.playing ? "Pause" : "Play"}
        </Text>
      ) : (
        <Text
          variant="body"
          size="md"
          onClick={() => {
            hmsActions.setVolume(!track.volume ? 100 : 0, track.id);
          }}
          classes={{ root: "text-red-tint cursor-pointer" }}
        >
          {track.volume === 0 ? "Unmute" : "Mute"}
        </Text>
      )}
    </div>
  );
};

const StreamingRecording = () => {
  const recording = useHMSStore(selectRecordingState);
  const rtmp = useHMSStore(selectRTMPState);
  const hls = useHMSStore(selectHLSState);

  if (
    !recording.browser.running &&
    !recording.server.running &&
    !hls.running &&
    !rtmp.running
  ) {
    return null;
  }

  const isRecordingOn = recording.browser.running || recording.server.running;
  const isStreamingOn = hls.running || rtmp.running;
  const getRecordingText = () => {
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

  const getStreamingText = () => {
    if (isStreamingOn) {
      return hls.running ? "HLS" : "RTMP";
    }
  };

  return (
    <div className="flex mx-2">
      {isRecordingOn && (
        <div className="flex items-center" title={getRecordingText()}>
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
      {isStreamingOn && (
        <div className="flex items-center mx-2" title={getStreamingText()}>
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
  const { HLS_VIEWER_ROLE } = useContext(AppContext);
  const localPeer = useHMSStore(selectLocalPeer);
  return (
    <>
      <Header
        leftComponents={[
          <LogoButton key={0} />,
          <Music key={1} />,
          <PlaylistMusic key={2} />,
          <StreamingRecording key={3} />,
        ]}
        centerComponents={[<SpeakerTag key={0} />]}
        rightComponents={[
          localPeer.roleName !== HLS_VIEWER_ROLE && <PIPComponent key={0} />,
          <ParticipantList
            key={1}
            onToggle={onParticipantListOpen}
            participantInListProps={participantInListProps}
          />,
        ]}
        classes={{ root: "h-full" }}
      />
    </>
  );
};
