import { useEffect } from "react";

export class FeatureFlags {
  static enableTranscription = process.env.REACT_APP_ENABLE_TRANSCRIPTION;

  static init() {
    if (!window.HMS) {
      window.HMS = {};
    }
    // unsubscribe for muted audio tracks
    window.HMS.AUDIO_SINK = true;
    // some extra config to hls js to bring down latency
    window.HMS.OPTIMISE_HLS_LATENCY = false;
    // ask permissions in preview even if role doesn't have it
    window.HMS.ALWAYS_REQUEST_PERMISSIONS = false;
    // update beam notification after server sends notification(remove flag)
    window.HMS.NEW_BEAM_STATE = true;
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
