import React, { useRef, useState, useEffect } from "react";
import { useDevices, DeviceType } from "@100mslive/react-sdk";
import { Dialog, Button, Text } from "@100mslive/react-ui";
import { AudioLevelIcon, SettingIcon } from "@100mslive/react-icons";
import { DialogContent, DialogRow, DialogSelect } from "./DialogContent";

const Settings = ({ children }) => {
  const { allDevices, selectedDeviceIDs, updateDevice } = useDevices();
  const { videoInput, audioInput, audioOutput } = allDevices;
  return (
    <Dialog>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <DialogContent Icon={SettingIcon} title="Settings">
        {videoInput.length && (
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
        )}
        {audioInput.length && (
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
        )}
        {audioOutput.length && (
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
        )}
        {audioOutput && (
          <DialogRow>
            <Text>Test Speaker:</Text>
            <TestAudio id={selectedDeviceIDs.audioOutput} />
          </DialogRow>
        )}
      </DialogContent>
    </Dialog>
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
        audioRef.current.setSinkId(id);
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
