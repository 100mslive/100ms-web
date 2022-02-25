import React, { useCallback, useEffect, useState } from "react";
import {
  selectPermissions,
  useHMSActions,
  useHMSStore,
  useRecordingStreaming,
} from "@100mslive/react-sdk";
import { RecordIcon } from "@100mslive/react-icons";
import { Button, Text, Dialog, Box } from "@100mslive/react-ui";
import {
  DialogContent,
  DialogInput,
  DialogRow,
  DialogSwitch,
} from "../new/DialogContent";
import { hmsToast } from "./notifications/hms-toast";
import { SKIP_PREVIEW } from "../../common/constants";

const defaultMeetingUrl =
  window.location.href.replace("meeting", "preview") + `?${SKIP_PREVIEW}=true`;

export const RecordingAndRTMPModal = ({ show, onToggle }) => {
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
  const [recordingSelected, setRecording] = useState(false);
  const isAnythingRunning =
    isBrowserRecordingOn || isHLSRecordingOn || isStreamingOn;

  const getText = useCallback(() => {
    let text = "";
    if (isStreamingOn) {
      text += "Streaming";
    }
    if (isBrowserRecordingOn || isHLSRecordingOn) {
      if (text) text += "/";
      text += "Recording";
    }
    text += " is running";
    return text;
  }, [isStreamingOn, isBrowserRecordingOn, isHLSRecordingOn]);

  useEffect(() => {
    setMeetingURL(defaultMeetingUrl);
  }, [show]);

  const startStopRTMPRecordingHLS = async action => {
    try {
      if (action === "start") {
        hlsSelected
          ? await hmsActions.startHLSStreaming({
              variants: [{ meetingURL: meetingURL }],
              recording: recordingSelected ? {} : undefined,
            })
          : await hmsActions.startRTMPOrRecording({
              meetingURL,
              rtmpURLs: rtmpURL.length > 0 ? [rtmpURL] : undefined,
              record: recordingSelected,
            });
      } else {
        isHLSRunning
          ? await hmsActions.stopHLSStreaming()
          : await hmsActions.stopRTMPAndRecording();
      }
    } catch (error) {
      console.error(
        `failed to start/stop ${
          hlsSelected ? "hls streaming" : "rtmp/recording"
        }`,
        error
      );
      hmsToast(error.message);
    } finally {
      setMeetingURL("");
      setRTMPURL("");
      setRecording(false);
      onToggle(false);
    }
  };

  return (
    <Dialog.Root open={show} onOpenChange={onToggle}>
      <DialogContent title="Streaming/Recording" Icon={RecordIcon}>
        <Box as="form" onSubmit={e => e.preventDefault()}>
          <DialogInput
            title="Meeting URL"
            value={meetingURL}
            onChange={setMeetingURL}
            placeholder="Enter meeting url"
            disabled={isAnythingRunning}
          />
          {permissions.streaming && (
            <DialogSwitch
              title="HLS"
              value={hlsSelected || isHLSRunning}
              onChange={setHLS}
              disabled={isAnythingRunning || rtmpURL[0]}
            />
          )}

          {permissions.streaming && (
            <DialogInput
              title="RTMP Out"
              value={rtmpURL}
              onChange={setRTMPURL}
              placeholder="Enter rtmp out url"
              disabled={isAnythingRunning || hlsSelected}
            />
          )}

          {permissions.recording && (
            <DialogSwitch
              title="Recording"
              value={
                recordingSelected || isBrowserRecordingOn || isHLSRecordingOn
              }
              disabled={isAnythingRunning}
              onChange={setRecording}
            />
          )}
          <DialogRow justify="end">
            {isAnythingRunning && (
              <Text variant="sm" css={{ color: "$eror" }}>
                {getText()}
              </Text>
            )}
            <Button
              variant="danger"
              type="reset"
              css={{ mx: "$4" }}
              onClick={() => startStopRTMPRecordingHLS("stop")}
              disabled={!isAnythingRunning}
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
            >
              Start
            </Button>
          </DialogRow>
        </Box>
      </DialogContent>
    </Dialog.Root>
  );
};
