import {
  selectHLSState,
  selectRecordingState,
  selectRTMPState,
  useHMSStore,
} from "@100mslive/react-sdk";

export const useRecordingStreaming = () => {
  const recording = useHMSStore(selectRecordingState);
  const rtmp = useHMSStore(selectRTMPState);
  const hls = useHMSStore(selectHLSState);

  const isServerRecordingOn = recording.server.running;
  const isBrowserRecordingOn = recording.browser.running;
  const isHLSRecordingOn = recording.hls.running;
  const isStreamingOn = hls.running || rtmp.running;

  return {
    isServerRecordingOn,
    isBrowserRecordingOn,
    isHLSRecordingOn,
    isStreamingOn,
    isHLSRunning: hls.running,
  };
};
