import React, { useRef, useState, useEffect } from "react";
import { useDevices, DeviceType } from "@100mslive/react-sdk";
import { Dialog, Button, Text } from "@100mslive/react-ui";
import { AudioLevelIcon, SettingIcon } from "@100mslive/react-icons";
import { DialogContent, DialogRow, DialogSelect } from "./DialogContent";

/**
 * wrap the button on click of whom settings should open, this component will take care of the rest,
 * it'll give the user options to change input/output device as well as check speaker.
 * There is also another controlled way of using this by passing in open and onOpenChange.
 */
const Settings = ({ open, onOpenChange, children }) => {
  const { allDevices, selectedDeviceIDs, updateDevice } = useDevices();
  const { videoInput, audioInput, audioOutput } = allDevices;
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <DialogContent Icon={SettingIcon} title="Settings">
        {videoInput?.length ? (
          <DeviceSelector
            title="Video"
            devices={videoInput}
            selection={selectedDeviceIDs.videoInput}
            onChange={deviceId =>
              updateDevice({
                deviceId,
                deviceType: DeviceType.videoInput,
              })
            }
          />
        ) : null}
        {audioInput?.length ? (
          <DeviceSelector
            title="Microphone"
            devices={audioInput}
            selection={selectedDeviceIDs.audioInput}
            onChange={deviceId =>
              updateDevice({
                deviceId,
                deviceType: DeviceType.audioInput,
              })
            }
          />
        ) : null}
        {audioOutput?.length ? (
          <DeviceSelector
            title="Speaker"
            devices={audioOutput}
            selection={selectedDeviceIDs.audioOutput}
            onChange={deviceId =>
              updateDevice({
                deviceId,
                deviceType: DeviceType.audioOutput,
              })
            }
          />
        ) : null}
        <DialogRow>
          <Text>Test Speaker:</Text>
          <TestAudio id={selectedDeviceIDs.audioOutput} />
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
};

const DeviceSelector = ({ title, devices, selection, onChange }) => {
  return (
    <DialogSelect
      title={title}
      options={devices}
      keyField="deviceId"
      labelField="label"
      selected={selection}
      onChange={onChange}
    />
  );
};

const TEST_AUDIO_URL = "https://100ms.live/test-audio.wav";

const TestAudio = ({ id }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (audioRef.current && id) {
      try {
        if (typeof audioRef.current.setSinkId !== undefined) {
          audioRef.current.setSinkId(id);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [id]);
  return (
    <>
      <Button
        variant="standard"
        onClick={() => audioRef.current?.play()}
        disabled={playing}
      >
        <AudioLevelIcon className="mr-2" /> Play
      </Button>
      <audio
        ref={audioRef}
        src={TEST_AUDIO_URL}
        onEnded={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
    </>
  );
};

export default Settings;
