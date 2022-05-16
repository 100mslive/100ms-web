import { useEffect } from "react";

export class FeatureFlags {
  static enableTranscription =
    process.env.REACT_APP_ENABLE_TRANSCRIPTION === "true";
  static enableStatsForNerds =
    process.env.REACT_APP_ENABLE_STATS_FOR_NERDS === "true";
  static enableWhiteboard =
    process.env.REACT_APP_ENABLE_WHITEBOARD === "true" &&
    process.env.REACT_APP_WHITEBOARD_WEBSOCKET_ENDPOINT;

  static init() {
    if (!window.HMS) {
      window.HMS = {};
    }
    // unsubscribe for muted audio tracks
    window.HMS.AUDIO_SINK = false;
    // some extra config to hls js to bring down latency
    window.HMS.OPTIMISE_HLS_LATENCY = false;
    // ask permissions in preview even if role doesn't have it
    window.HMS.ALWAYS_REQUEST_PERMISSIONS = false;
    // add support for server degradation
    window.HMS.FREEZE_VIDEO_LIST = false; // process.env.REACT_APP_ENV === "qa";
  }

  static freezeVideoList() {
    return window.HMS.FREEZE_VIDEO_LIST;
  }

  static optimiseHLSLatency() {
    return window.HMS.OPTIMISE_HLS_LATENCY;
  }

  static alwaysRequestPermissions() {
    return window.HMS.ALWAYS_REQUEST_PERMISSIONS;
  }
}

export function FeatureFlagsInit() {
  useEffect(() => {
    FeatureFlags.init();
  }, []);
  return null;
}
