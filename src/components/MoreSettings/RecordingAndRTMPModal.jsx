import React, { useCallback, useMemo, useState } from "react";
import {
  selectPermissions,
  useHMSActions,
  useHMSStore,
  useRecordingStreaming,
} from "@100mslive/react-sdk";
import { RecordIcon } from "@100mslive/react-icons";
import { Button, Text, Dialog, Box } from "@100mslive/react-ui";
import {
  DialogCheckbox,
  DialogContent,
  DialogInput,
  DialogRow,
} from "../../primitives/DialogContent";
import { ToastManager } from "../Toast/ToastManager";
import { ResolutionInput } from "./ResolutionInput";
import {
  QUERY_PARAM_SKIP_PREVIEW,
  RTMP_RECORD_DEFAULT_RESOLUTION,
  RTMP_RESOLUTION_IGNORED_WARNING_TEXT,
} from "../../common/constants";

const defaultMeetingUrl =
  window.location.href.replace("meeting", "preview") +
  `?${QUERY_PARAM_SKIP_PREVIEW}=true`;

export const RecordingAndRTMPModal = ({ onOpenChange }) => {
  const hmsActions = useHMSActions();
  const permissions = useHMSStore(selectPermissions);
  const {
    isHLSRecordingOn,
    isHLSRunning,
    isStreamingOn,
    isBrowserRecordingOn,
  } = useRecordingStreaming();

  const [meetingURL, setMeetingURL] = useState(defaultMeetingUrl);
  const [rtmpURL, setRTMPURL] = useState("");
  const [hlsSelected, setHLS] = useState(false);
  const [recordingResolution, setRecordingResolution] = useState(
    RTMP_RECORD_DEFAULT_RESOLUTION
  );
  const [recordingSelected, setRecording] = useState(false);
  const isRecordingOn = isBrowserRecordingOn || isHLSRecordingOn;
  const isAnythingRunning = isRecordingOn || isStreamingOn;

  const recordingStreamingStatusText = useMemo(() => {
    let text = "";
    if (isStreamingOn) {
      text += "Streaming";
    }
    if (isRecordingOn) {
      if (text) text += "/";
      text += "Recording";
    }
    text += " is running";
    return text;
  }, [isStreamingOn, isRecordingOn]);

  const resolutionChangeHandler = useCallback(
    resolution => setRecordingResolution(resolution),
    []
  );
  const startStopRTMPRecordingHLS = async action => {
    try {
      if (action === "start") {
        // the skip_preview param only works for preview link, replace meeting with preview if needed
        const urlToStreamRecord = meetingURL.replace(
          "app.100ms.live/meeting",
          "app.100ms.live/preview"
        );
        if (hlsSelected) {
          await hmsActions.startHLSStreaming({
            variants: [{ meetingURL: urlToStreamRecord }],
            recording: recordingSelected
              ? { hlsVod: true, singleFilePerLayer: true }
              : undefined,
          });
        } else {
          const rtmpRecordParams = {
            meetingURL: urlToStreamRecord,
            rtmpURLs: rtmpURL.length > 0 ? [rtmpURL] : undefined,
            record: recordingSelected,
          };
          const resolution = getResolution();

          if (resolution) {
            rtmpRecordParams.resolution = resolution;
          }
          await hmsActions.startRTMPOrRecording(rtmpRecordParams);
        }
      } else {
        isHLSRunning
          ? await hmsActions.stopHLSStreaming()
          : await hmsActions.stopRTMPAndRecording();
      }
      onOpenChange(false);
    } catch (error) {
      console.error(
        `failed to start/stop ${
          hlsSelected ? "hls streaming" : "rtmp/recording"
        }`,
        error
      );
      ToastManager.addToast({ title: error.message });
    }

    function getResolution() {
      const resolution = {};
      if (recordingResolution.width) {
        resolution.width = recordingResolution.width;
      }
      if (recordingResolution.height) {
        resolution.height = recordingResolution.height;
      }
      if (Object.keys(resolution).length > 0) {
        return resolution;
      }
    }
  };

  return (
    <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
      <DialogContent title="Streaming/Recording" Icon={RecordIcon}>
        <Box as="form" onSubmit={e => e.preventDefault()}>
          <DialogInput
            title="Meeting URL"
            value={meetingURL}
            onChange={setMeetingURL}
            placeholder="Enter meeting url"
            disabled={isAnythingRunning}
            data-testid="metting_url_field"
          />
          {permissions.streaming && (
            <DialogInput
              title="RTMP Out"
              value={rtmpURL}
              onChange={setRTMPURL}
              placeholder="Enter rtmp out url"
              disabled={isAnythingRunning || hlsSelected}
              data-testid="rtmp_url_field"
            />
          )}

          <ResolutionInput
            onResolutionChange={resolutionChangeHandler}
            disabled={hlsSelected || isHLSRunning}
            tooltipText={RTMP_RESOLUTION_IGNORED_WARNING_TEXT}
          />

          {permissions.streaming && (
            <DialogCheckbox
              title="HLS"
              id="hlsCheckbox"
              value={hlsSelected || isHLSRunning}
              onChange={setHLS}
              disabled={isAnythingRunning || rtmpURL[0]}
            />
          )}
          {permissions.recording && (
            <DialogCheckbox
              title="Recording"
              value={recordingSelected || isRecordingOn}
              disabled={isAnythingRunning}
              id="recordingCheckbox"
              onChange={setRecording}
            />
          )}
          <DialogRow justify="end">
            {isAnythingRunning && (
              <Text variant="sm" css={{ color: "$error" }}>
                {recordingStreamingStatusText}
              </Text>
            )}
            <Button
              variant="danger"
              type="reset"
              css={{ mx: "$4" }}
              onClick={() => startStopRTMPRecordingHLS("stop")}
              disabled={!isAnythingRunning}
              data-testid="rtmp_recording_stop"
            >
              Stop
            </Button>
            <Button
              variant="primary"
              type="submit"
              onClick={() => startStopRTMPRecordingHLS("start")}
              disabled={
                isAnythingRunning ||
                (!hlsSelected && !recordingSelected && !rtmpURL)
              }
              data-testid="rtmp_recording_start"
            >
              Start
            </Button>
          </DialogRow>
        </Box>
      </DialogContent>
    </Dialog.Root>
  );
};
