import React, { useCallback, useEffect, useState } from "react";
import {
  Input,
  Button,
  Text,
  Dialog,
  Label,
  Switch,
} from "@100mslive/react-ui";
import {
  selectPermissions,
  useHMSActions,
  useHMSStore,
  useRecordingStreaming,
} from "@100mslive/react-sdk";
import { DialogContent, DialogRow } from "../new/DialogContent";
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
      <DialogContent title="Streaming/Recording">
        <form onSubmit={e => e.preventDefault()}>
          <DialogRow>
            <Label>Meeting URL:</Label>
            <Input
              type="text"
              value={meetingURL}
              onChange={e => setMeetingURL(e.target.value)}
              disabled={isAnythingRunning}
            />
          </DialogRow>

          {permissions.streaming && (
            <DialogRow>
              <Label>HLS:</Label>
              <Switch
                checked={hlsSelected || isHLSRunning}
                onCheckedChange={setHLS}
                disabled={isAnythingRunning || rtmpURL[0]}
              />
            </DialogRow>
          )}

          {permissions.streaming && (
            <DialogRow>
              <Label>RTMP:</Label>
              <Input
                type="text"
                value={rtmpURL}
                onChange={e => setRTMPURL(e.target.value)}
                disabled={isAnythingRunning}
              />
            </DialogRow>
          )}

          {permissions.recording && (
            <DialogRow>
              <Label>Recording:</Label>
              <Switch
                checked={
                  recordingSelected || isBrowserRecordingOn || isHLSRecordingOn
                }
                disabled={isAnythingRunning}
                onCheckedChange={setRecording}
              />
            </DialogRow>
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
              disabled={isAnythingRunning}
            >
              Start
            </Button>
          </DialogRow>
        </form>
      </DialogContent>
    </Dialog.Root>
  );
};
