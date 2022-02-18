import React, { useCallback, useEffect, useState } from "react";
import { Button, MessageModal, Text } from "@100mslive/hms-video-react";
import { hmsToast } from "./notifications/hms-toast";
import {
  selectHLSState,
  selectRecordingState,
  selectRTMPState,
  useHMSStore,
  useHMSActions,
} from "@100mslive/react-sdk";
import { SKIP_PREVIEW } from "../../common/constants";

const defaultClasses = {
  iconContainer: "focus:outline-none mr-3 hover:bg-gray-200 p-2 rounded-lg",
  dialogRoot: "rounded-xl ",
  dialogContainer:
    "bg-white text-gray-100 dark:bg-gray-100 dark:text-white w-full p-2 overflow-y-auto rounded-xl",
  dialogInner: "text-2xl p-2 flex justify-between",
  titleContainer: "flex items-center",
  titleIcon: "pr-4",
  titleText: "text-2xl leading-7",
  formContainer: "flex flex-wrap p-3 pt-0 md:p-0 text-base md:mb-0",
  formInner: "w-full flex flex-col md:flex-row my-1.5",
  selectLabel: "w-full md:w-1/3 flex justify-start md:justify-end items-center",
  selectContainer:
    "rounded-lg w-full md:w-1/2 bg-gray-600 dark:bg-gray-200 p-2 mx-0 my-2 md:my-0 md:mx-2",
  select:
    "rounded-lg w-full h-full bg-gray-600 dark:bg-gray-200 focus:outline-none",
  selectInner: "px-4 pb-5",
  divider: "bg-gray-600 dark:bg-gray-200 h-px w-full my-4",
  gap: "w-full pt-4",
  errorContainer: "flex justify-center items-center w-full px-8 py-4",
  testAudioContainer: "mx-0 my-2 md:my-0 md:mx-2",
};

const defaultMeetingUrl =
  window.location.href.replace("meeting", "preview") + `?${SKIP_PREVIEW}=true`;

export const RecordingAndRTMPModal = ({
  showRecordingAndRTMPModal,
  setShowRecordingAndRTMPModal,
  permissions,
}) => {
  useEffect(() => {
    setMeetingURL(defaultMeetingUrl);
  }, [showRecordingAndRTMPModal]);
  const hmsActions = useHMSActions();
  const recording = useHMSStore(selectRecordingState);
  const rtmp = useHMSStore(selectRTMPState);
  const hls = useHMSStore(selectHLSState);

  const [meetingURL, setMeetingURL] = useState(defaultMeetingUrl);
  const [rtmpURL, setRTMPURL] = useState("");
  const [isHlsOn, setIsHlsOn] = useState(false);
  const [isRecordingOn, setIsRecordingOn] = useState(false);

  const getText = useCallback(() => {
    let text = "";
    if (rtmp.running || hls.running) {
      text += "Streaming";
    }
    if (recording.browser.running || recording.hls.running) {
      if (text) text += "/";
      text += "Recording";
    }
    text += " is running";
    return text;
  }, [
    recording.browser.running,
    recording.hls.running,
    rtmp.running,
    hls.running,
  ]);

  const startStopRTMPRecordingHLS = async action => {
    try {
      if (action === "start") {
        isHlsOn
          ? await hmsActions.startHLSStreaming({
              variants: [{ meetingURL: meetingURL }],
              recording: isRecordingOn ? {} : undefined,
            })
          : await hmsActions.startRTMPOrRecording({
              meetingURL,
              rtmpURLs: rtmpURL.length > 0 ? [rtmpURL] : undefined,
              record: isRecordingOn,
            });
      } else {
        hls.running
          ? await hmsActions.stopHLSStreaming()
          : await hmsActions.stopRTMPAndRecording();
      }
    } catch (error) {
      isHlsOn
        ? console.error("failed to start/stop hls streaming", error)
        : console.error("failed to start/stop rtmp/recording", error);
      hmsToast(error.message);
    } finally {
      setMeetingURL("");
      setRTMPURL("");
      setIsRecordingOn(false);
      setShowRecordingAndRTMPModal(false);
    }
  };

  return (
    <MessageModal
      title="Start Streaming/Recording"
      body={
        <RecordingAndStreamingForm
          meetingURL={meetingURL}
          rtmpURL={rtmpURL}
          isRecordingOn={isRecordingOn}
          isRecordingRunning={
            recording.browser.running || recording.hls.running
          }
          isRTMPRunning={rtmp.running}
          setIsRecordingOn={setIsRecordingOn}
          setMeetingURL={setMeetingURL}
          setRTMPURL={setRTMPURL}
          isHlsOn={isHlsOn}
          setIsHlsOn={setIsHlsOn}
          isHLSRunning={hls.running}
          permissions={permissions}
        />
      }
      footer={
        <>
          {(recording.browser.running || rtmp.running || hls.running) && (
            <Text
              variant="body"
              size="md"
              classes={{ root: "mx-2 self-center text-yellow-500" }}
            >
              {getText()}
            </Text>
          )}
          <div className="space-x-1">
            <Button
              variant="danger"
              shape="rectangle"
              onClick={() => startStopRTMPRecordingHLS("stop")}
              disabled={
                !recording.browser.running && !rtmp.running && !hls.running
              }
            >
              Stop
            </Button>
            <Button
              variant="emphasized"
              shape="rectangle"
              onClick={() => startStopRTMPRecordingHLS("start")}
              disabled={
                recording.browser.running || rtmp.running || hls.running
              }
            >
              Start
            </Button>
          </div>
        </>
      }
      show={showRecordingAndRTMPModal}
      onClose={() => setShowRecordingAndRTMPModal(false)}
    />
  );
};

export const RecordingAndStreamingForm = ({
  isRecordingRunning,
  isRTMPRunning,
  isHLSRunning,
  isRecordingOn,
  setIsRecordingOn,
  meetingURL,
  setMeetingURL,
  rtmpURL,
  setRTMPURL,
  isHlsOn,
  setIsHlsOn,
  permissions,
}) => {
  const isAnythingRunning = isRecordingRunning || isRTMPRunning || isHLSRunning;
  return (
    <div>
      <form>
        <TextInput
          inputName="Meeting URL:"
          value={meetingURL}
          onChangeHandler={setMeetingURL}
          disabled={isAnythingRunning}
        />

        {permissions.streaming && (
          <SwitchInput
            inputName="HLS:"
            checked={isHlsOn || isHLSRunning}
            onChangeHandler={setIsHlsOn}
            disabled={isAnythingRunning || rtmpURL[0]}
          />
        )}

        {permissions.streaming && (
          <TextInput
            inputName="RTMP"
            value={rtmpURL}
            onChangeHandler={setRTMPURL}
            disabled={isAnythingRunning || isHlsOn}
          />
        )}

        {permissions.recording && (
          <SwitchInput
            inputName="Recording:"
            checked={isRecordingOn || isRecordingRunning}
            disabled={isAnythingRunning}
            onChangeHandler={setIsRecordingOn}
          />
        )}
      </form>
    </div>
  );
};

const TextInput = ({ inputName, disabled, value, onChangeHandler, props }) => {
  return (
    <div className={defaultClasses.formInner}>
      <div className={defaultClasses.selectLabel}>
        <Text variant="heading" size="sm">
          {inputName}
        </Text>
      </div>

      <div className={defaultClasses.selectContainer}>
        <input
          type="text"
          className={defaultClasses.select}
          value={value}
          onChange={e => onChangeHandler(e.target.value)}
          disabled={disabled}
          {...props}
        />
      </div>
    </div>
  );
};

const SwitchInput = ({
  inputName,
  checked,
  disabled,
  onChangeHandler,
  props,
}) => {
  return (
    <div className={defaultClasses.formInner}>
      <div className={defaultClasses.selectLabel}>
        <Text variant="heading" size="sm">
          {inputName}
        </Text>
      </div>
      <div className={defaultClasses.selectInner}>
        <input
          className="custom-toggle"
          type="checkbox"
          id={`${inputName}Checkbox`}
          checked={checked}
          onChange={e => onChangeHandler(e.target.checked)}
          disabled={disabled}
          {...props}
        />
        <label
          className="custom-toggle-label"
          htmlFor={`${inputName}Checkbox`}
        ></label>
      </div>
    </div>
  );
};
