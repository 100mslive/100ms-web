import {
  Header,
  ParticipantList,
  LogoButton,
  GlobeIcon,
} from "@100mslive/hms-video-react";
import { useCallback, useContext } from "react";
import { SpeakerIcon, RecordIcon } from "@100mslive/react-icons";
import { Text } from "@100mslive/react-ui";
import {
  useHMSActions,
  useHMSStore,
  selectDominantSpeaker,
  selectPeerSharingAudio,
  selectScreenShareAudioByPeerID,
  selectPeerSharingAudioPlaylist,
  selectAudioPlaylistTrackByPeerID,
  selectRecordingState,
  selectRTMPState,
  selectAudioPlaylist,
  selectHLSState,
  selectLocalPeer,
} from "@100mslive/react-sdk";
import PIPComponent from "./PIP/PIPComponent";
import { AppContext } from "../store/AppContext";
import { metadataProps as participantInListProps } from "../common/utils";
import { AmbientMusic } from "./components/AmbientMusic";

const SpeakerTag = () => {
  const dominantSpeaker = useHMSStore(selectDominantSpeaker);
  return dominantSpeaker && dominantSpeaker.name ? (
    <div className="self-center focus:outline-none text-lg flex items-center">
      <SpeakerIcon />
      <Text
        variant="body"
        className="truncate max-w-xs"
        css={{ ml: "$1", flex: "1 1 0" }}
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
      <SpeakerIcon />
      <Text variant="body" css={{ mx: "$1" }}>
        Music is playing
      </Text>
      <Text
        variant="body"
        onClick={handleMute}
        css={{ color: "$redMain", cursor: "pointer" }}
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
      <SpeakerIcon />
      <Text variant="body" css={{ mx: "$1" }}>
        Playlist is playing
      </Text>
      {peer.isLocal ? (
        <Text
          variant="body"
          onClick={async () => {
            if (selection.playing) {
              await hmsActions.audioPlaylist.pause();
            } else {
              await hmsActions.audioPlaylist.play(selection.id);
            }
          }}
          css={{ color: "$redMain", cursor: "pointer" }}
        >
          {selection.playing ? "Pause" : "Play"}
        </Text>
      ) : (
        <Text
          variant="body"
          onClick={() => {
            hmsActions.setVolume(!track.volume ? 100 : 0, track.id);
          }}
          css={{ color: "$redMain", cursor: "pointer" }}
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
  const isRecordingOn =
    recording.browser.running ||
    recording.server.running ||
    recording.hls.running;
  const isStreamingOn = hls.running || rtmp.running;

  const getRecordingText = useCallback(() => {
    if (!isRecordingOn) {
      return "";
    }
    let title = "";
    if (recording.browser.running) {
      title += "Browser";
    }
    if (recording.server.running) {
      if (title) {
        title += ", ";
      }
      title += "Server";
    }
    if (recording.hls.running) {
      if (title) {
        title += ", ";
      }
      title += "HLS";
    }
    return title;
  }, [
    isRecordingOn,
    recording.browser.running,
    recording.hls.running,
    recording.server.running,
  ]);

  if (!isRecordingOn && !isStreamingOn) {
    return null;
  }

  const getStreamingText = () => {
    if (isStreamingOn) {
      return hls.running ? "HLS" : "RTMP";
    }
  };

  return (
    <div className="flex mx-2">
      {isRecordingOn && (
        <div className="flex items-center" title={getRecordingText()}>
          <RecordIcon
            className="fill-current text-red-600"
            width="20"
            height="20"
          />
          <Text variant="body" css={{ mx: "$1" }}>
            Recording
          </Text>
        </div>
      )}
      {isStreamingOn && (
        <div className="flex items-center mx-2" title={getStreamingText()}>
          <GlobeIcon className="fill-current text-red-600" />
          <Text variant="body" css={{ mx: "$1" }}>
            Streaming
          </Text>
        </div>
      )}
    </div>
  );
};

export const ConferenceHeader = ({
  onParticipantListOpen,
  isPreview = false,
}) => {
  const {
    HLS_VIEWER_ROLE,
    loginInfo: { isHeadless },
  } = useContext(AppContext);
  const localPeer = useHMSStore(selectLocalPeer);
  const showPip = localPeer?.roleName !== HLS_VIEWER_ROLE && !isPreview;
  return (
    <>
      <Header
        leftComponents={[
          <LogoButton key={0} />,
          <Music key={1} />,
          <PlaylistMusic key={2} />,
          <StreamingRecording key={3} />,
        ]}
        centerComponents={[!isPreview ? <SpeakerTag key={0} /> : null]}
        rightComponents={[
          !isHeadless ? <AmbientMusic key={2} /> : null,
          showPip ? <PIPComponent key={0} /> : null,
          <ParticipantList
            key={1}
            onToggle={onParticipantListOpen}
            participantInListProps={participantInListProps}
          />,
        ]}
        classes={{ root: "h-full", rightRoot: "items-center" }}
      />
    </>
  );
};
