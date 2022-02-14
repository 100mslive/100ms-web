import React, { useRef, useState, useEffect } from "react";
import { useDevices, DeviceType } from "@100mslive/react-sdk";
import { Dialog, Select, styled, Button } from "@100mslive/react-ui";
import { AudioLevelIcon } from "@100mslive/react-icons";

const Settings = ({ children }) => {
  const { allDevices, selectedDeviceIDs, updateDevice } = useDevices();
  const { videoInput, audioInput, audioOutput } = allDevices;
  return (
    <Dialog>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content title="Settings">
        {videoInput ? (
          <Box>
            <span>Video:</span>
            <Select
              onChange={e =>
                updateDevice({
                  deviceId: e.target.value,
                  deviceType: DeviceType.videoInput,
                })
              }
              value={selectedDeviceIDs.videoInput}
            >
              {videoInput.map(device => (
                <option value={device.deviceId} key={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </Select>
          </Box>
        ) : null}
        {audioInput ? (
          <Box>
            <span>Microphone:</span>
            <Select
              onChange={e =>
                updateDevice({
                  deviceId: e.target.value,
                  deviceType: DeviceType.audioInput,
                })
              }
              value={selectedDeviceIDs.audioInput}
            >
              {audioInput.map(device => (
                <option value={device.deviceId} key={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </Select>
          </Box>
        ) : null}
        {audioOutput ? (
          <Box>
            <span>Speaker:</span>
            <Select
              onChange={e =>
                updateDevice({
                  deviceId: e.target.value,
                  deviceType: DeviceType.audioOutput,
                })
              }
              value={selectedDeviceIDs.audioOutput}
            >
              {audioOutput.map(device => (
                <option value={device.deviceId} key={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </Select>
          </Box>
        ) : null}
        {audioOutput ? (
          <Box>
            <span>Test Audio Level:</span>
            <TestAudio id={selectedDeviceIDs.audioOutput} />
          </Box>
        ) : null}
      </Dialog.Content>
    </Dialog>
  );
};

export default Settings;

const Box = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  margin: "1rem 0",
});

const TEST_AUDIO_URL = "https://100ms.live/test-audio.wav";

export const TestAudio = ({ id }) => {
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
  }, [audioRef.current, id]);
  return (
    <>
      <Button
        variant="standard"
        onClick={() => audioRef.current?.play()}
        disabled={playing}
      >
        <AudioLevelIcon className="mr-2" /> Play Audio Level Test
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
