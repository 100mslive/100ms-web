import React, { useState } from "react";
import {
  selectAppData,
  selectPermissions,
  useHMSActions,
  useHMSStore,
  useRecordingStreaming,
} from "@100mslive/react-sdk";
import { AlertTriangleIcon } from "@100mslive/react-icons";
import { Button, Dialog, Flex, Text } from "@100mslive/react-ui";
import { ResolutionInput } from "../Streaming/ResolutionInput";
import { getResolution } from "../Streaming/RTMPStreaming";
import { ToastManager } from "../Toast/ToastManager";
import { useSetAppDataByKey } from "../AppData/useUISettings";
import { getDefaultMeetingUrl } from "../../common/utils";
import {
  APP_DATA,
  RTMP_RECORD_DEFAULT_RESOLUTION,
} from "../../common/constants";

const StartRecording = ({ open, onOpenChange }) => {
  const permissions = useHMSStore(selectPermissions);
  const recordingUrl = useHMSStore(selectAppData(APP_DATA.recordingUrl));
  const [resolution, setResolution] = useState(RTMP_RECORD_DEFAULT_RESOLUTION);

  const [recordingStarted, setRecordingState] = useSetAppDataByKey(
    APP_DATA.recordingStarted
  );
  const { isBrowserRecordingOn, isStreamingOn, isHLSRunning } =
    useRecordingStreaming();
  const hmsActions = useHMSActions();
  if (!permissions?.browserRecording || isHLSRunning) {
    return null;
  }
  if (isBrowserRecordingOn) {
    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Content
            css={{
              width: "min(400px,80%)",
              p: "$10",
              bg: "#201617",
            }}
          >
            <Dialog.Title>
              <Flex gap={2} css={{ c: "$error" }}>
                <AlertTriangleIcon />
                <Text css={{ c: "inherit" }} variant="h6">
                  End Recording
                </Text>
              </Flex>
            </Dialog.Title>
            <Text variant="sm" css={{ c: "$textMedEmp", my: "$8" }}>
              Are you sure you want to end recording? You can’t undo this
              action.
            </Text>
            <Flex justify="end" css={{ mt: "$12" }}>
              <Dialog.Close asChild>
                <Button
                  outlined
                  css={{ borderColor: "$secondaryLight", mr: "$4" }}
                >
                  Don't end
                </Button>
              </Dialog.Close>
              <Button
                data-testid="stop_recording_confirm_mobile"
                variant="danger"
                icon
                onClick={async () => {
                  try {
                    await hmsActions.stopRTMPAndRecording();
                  } catch (error) {
                    ToastManager.addToast({
                      title: error.message,
                      variant: "error",
                    });
                  }
                  onOpenChange(false);
                }}
              >
                End recording
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content css={{ width: "min(400px,80%)", p: "$10" }}>
        <Dialog.Title>
          <Text variant="h6">Start Recording</Text>
        </Dialog.Title>
        <ResolutionInput
          testId="recording_resolution_mobile"
          css={{ flexDirection: "column", alignItems: "start" }}
          onResolutionChange={setResolution}
        />
        <Button
          data-testid="start_recording_confirm_mobile"
          variant="primary"
          icon
          css={{ ml: "auto" }}
          type="submit"
          disabled={recordingStarted || isStreamingOn}
          onClick={async () => {
            try {
              setRecordingState(true);
              await hmsActions.startRTMPOrRecording({
                meetingURL: recordingUrl || getDefaultMeetingUrl(),
                resolution: getResolution(resolution),
                record: true,
              });
            } catch (error) {
              if (error.message.includes("stream already running")) {
                ToastManager.addToast({
                  title: "Recording already running",
                  variant: "error",
                });
              } else {
                ToastManager.addToast({
                  title: error.message,
                  variant: "error",
                });
              }
              setRecordingState(false);
            }
            onOpenChange(false);
          }}
        >
          Start
        </Button>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default StartRecording;
