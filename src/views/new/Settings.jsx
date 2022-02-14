// @ts-ignore
import React from "react";
import {
  useDevices,
  DeviceType,
  selectIsAllowedToPublish,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Dialog } from "@100mslive/react-ui";

const Settings = ({ children }) => {
  const { allDevices, selectedDeviceIDs, updateDevice } = useDevices();
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const videoInput = allDevices["videoInput"] || [];
  const audioInput = allDevices["audioInput"] || [];
  const audioOutput = allDevices["audioOutput"] || [];
  return (
    <Dialog>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content title="Settings">
        {videoInput.length > 0 && isAllowedToPublish.video ? (
          <div>
            <span>Video</span>
            <select
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
            </select>
          </div>
        ) : null}
        {audioInput.length > 0 && isAllowedToPublish.audio ? (
          <div>
            <span>Microphone</span>
            <select
              onChange={e => {
                updateDevice({
                  deviceId: e.target.value,
                  deviceType: DeviceType.audioInput,
                });
              }}
              value={selectedDeviceIDs.audioInput}
            >
              {audioInput.map(device => (
                <option value={device.deviceId} key={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        {audioOutput.length > 0 ? (
          <div>
            <span>Speaker</span>
            <select
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
            </select>
          </div>
        ) : null}
      </Dialog.Content>
    </Dialog>
  );
};

export default Settings;
