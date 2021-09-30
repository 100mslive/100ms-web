import React from "react";
import { Text } from "@100mslive/hms-video-react";

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
  selectInner: "px-4 pb-4",
  divider: "bg-gray-600 dark:bg-gray-200 h-px w-full my-4",
  gap: "w-full pt-4",
  errorContainer: "flex justify-center items-center w-full px-8 py-4",
  testAudioContainer: "mx-0 my-2 md:my-0 md:mx-2",
};

export const RecordingAndRTMPForm = ({
  meetingURL,
  RTMPURLs,
  isRecordingOn,
  recordingStatus,
  rtmpStatus,
  setIsRecordingOn,
  setMeetingURL,
  setRTMPURLs,
}) => {
  return (
    <div>
      <form>
        <div className={defaultClasses.formInner}>
          <div className={defaultClasses.selectLabel}>
            <Text variant="heading" size="sm">
              meeting_url:
            </Text>
          </div>

          <div className={defaultClasses.selectContainer}>
            <input
              type="text"
              className={defaultClasses.select}
              value={meetingURL}
              onChange={e => setMeetingURL(e.target.value)}
              disabled={recordingStatus || rtmpStatus}
            />
          </div>
        </div>
        <div className={`${defaultClasses.formInner} mb-5`}>
          <div className={defaultClasses.selectLabel}>
            <Text variant="heading" size="sm">
              rtmp_url:
            </Text>
          </div>

          <div className={defaultClasses.selectContainer}>
            <input
              type="text"
              className={`${defaultClasses.select}`}
              value={RTMPURLs}
              onChange={e => setRTMPURLs(e.target.value)}
              disabled={recordingStatus || rtmpStatus}
            />
          </div>
        </div>
        <hr />
        <div className={defaultClasses.formInner}>
          <div className={defaultClasses.selectLabel}>
            <Text variant="heading" size="sm">
              Recording:
            </Text>
          </div>
          <div className={defaultClasses.selectInner}>
            <input
              className="custom-toggle"
              type="checkbox"
              id="recordingOnCheckbox"
              checked={isRecordingOn || recordingStatus}
              onChange={e => setIsRecordingOn(e.target.checked)}
            />
            <label
              className="custom-toggle-label"
              htmlFor="recordingOnCheckbox"
            ></label>
          </div>
        </div>
      </form>
    </div>
  );
};
