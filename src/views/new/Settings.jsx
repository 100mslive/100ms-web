import React, { useRef, useState, useEffect } from "react";
import { useDevices, DeviceType } from "@100mslive/react-sdk";
import { Dialog, Select, Button, Flex, Text } from "@100mslive/react-ui";
import { AudioLevelIcon } from "@100mslive/react-icons";
import { HorizontalDivider } from "@100mslive/react-ui";

const Row = ({ children }) => {
  return (
    <Flex
      align="center"
      justify="between"
      css={{
        margin: "1.5rem 0",
        "@sm": {
          flexDirection: "column",
          alignItems: "flex-start",
        },
      }}
    >
      {children}
    </Flex>
  );
};

const Settings = ({ children }) => {
  const { allDevices, selectedDeviceIDs, updateDevice } = useDevices();
  const { videoInput, audioInput, audioOutput } = allDevices;
  return (
    <Dialog>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content title="Settings" css={{ width: "min(600px, 100%)" }}>
        <HorizontalDivider css={{ mt: "0.8rem" }} />
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
          <Row>
            <Text>Test Speaker:</Text>
            <TestAudio id={selectedDeviceIDs.audioOutput} />
          </Row>
        )}
      </Dialog.Content>
    </Dialog>
  );
};

const DeviceSelector = ({ title, devices, selection, onChange }) => {
  return (
    <Row>
      <Text>{title}:</Text>
      <Select.Root css={{ width: "70%", "@sm": { width: "100%" } }}>
        <Select.DefaultDownIcon />
        <Select.Select
          onChange={e => onChange(e.target.value)}
          value={selection}
          css={{ width: "100%" }}
        >
          {devices.map(device => (
            <option value={device.deviceId} key={device.deviceId}>
              {device.label}
            </option>
          ))}
        </Select.Select>
      </Select.Root>
    </Row>
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
