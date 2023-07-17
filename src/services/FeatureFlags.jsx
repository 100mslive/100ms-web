import { useEffect } from "react";
import { selectRoomID, useHMSStore } from "@100mslive/react-sdk";

export class FeatureFlags {
  static enableTranscription =
    process.env.REACT_APP_ENABLE_TRANSCRIPTION === "true";
  static enableStatsForNerds =
    process.env.REACT_APP_ENABLE_STATS_FOR_NERDS === "true";
  static enableWhiteboard =
    process.env.REACT_APP_ENABLE_WHITEBOARD &&
    process.env.REACT_APP_PUSHER_APP_KEY &&
    process.env.REACT_APP_PUSHER_AUTHENDPOINT;
  static enableBeamSpeakersLogging =
    process.env.REACT_APP_ENABLE_BEAM_SPEAKERS_LOGGING === "true";

  static init(roomId) {
    if (!window.HMS) {
      window.HMS = {};
    }
    // some extra config to hls js to bring down latency
    window.HMS.OPTIMISE_HLS_LATENCY = false;
    // ask permissions in preview even if role doesn't have it
    window.HMS.ALWAYS_REQUEST_PERMISSIONS = false;

    this.enableTranscription =
      process.env.REACT_APP_TRANSCRIPTION_ROOM_ID === roomId;
  }

  static optimiseHLSLatency() {
    return window.HMS.OPTIMISE_HLS_LATENCY;
  }

  static alwaysRequestPermissions() {
    return window.HMS.ALWAYS_REQUEST_PERMISSIONS;
  }
}

export function FeatureFlagsInit() {
  const roomId = useHMSStore(selectRoomID);
  useEffect(() => {
    if (roomId) {
      FeatureFlags.init(roomId);
    }
  }, [roomId]);
  return null;
}
