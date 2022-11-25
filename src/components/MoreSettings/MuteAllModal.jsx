import React, { useCallback, useState } from "react";
import { useHMSActions } from "@100mslive/react-sdk";
import { MicOffIcon } from "@100mslive/react-icons";
import {
  Button,
  Dialog,
  Flex,
  Label,
  RadioGroup,
  Text,
} from "@100mslive/react-ui";
import {
  DialogContent,
  DialogRow,
  DialogSelect,
} from "../../primitives/DialogContent";
import { useFilteredRoles } from "../../common/hooks";

const trackSourceOptions = [
  { label: "All Track Sources", value: "" },
  { label: "regular", value: "regular" },
  { label: "screen", value: "screen" },
  { label: "audioplaylist", value: "audioplaylist" },
  { label: "videoplaylist", value: "videoplaylist" },
];
const trackTypeOptions = [
  { label: "All Track Types", value: "" },
  { label: "audio", value: "audio" },
  { label: "video", value: "video" },
];
export const MuteAllModal = ({ onOpenChange }) => {
  const roles = useFilteredRoles();
  const hmsActions = useHMSActions();
  const [enabled, setEnabled] = useState(false);
  const [trackType, setTrackType] = useState();
  const [selectedRole, setRole] = useState();
  const [selectedSource, setSource] = useState();

  const muteAll = useCallback(async () => {
    await hmsActions.setRemoteTracksEnabled({
      enabled: enabled,
      type: trackType,
      source: selectedSource,
      roles: selectedRole ? [selectedRole] : undefined,
    });
    onOpenChange(false);
  }, [
    selectedRole,
    enabled,
    trackType,
    selectedSource,
    hmsActions,
    onOpenChange,
  ]);

  return (
    <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
      <DialogContent title="Mute/Unmute Remote Tracks" Icon={MicOffIcon}>
        <DialogSelect
          title="Role"
          options={[
            { label: "All Roles", value: "" },
            ...roles.map(role => ({ label: role, value: role })),
          ]}
          selected={selectedRole}
          keyField="value"
          labelField="label"
          onChange={setRole}
        />
        <DialogSelect
          title="Track type"
          options={trackTypeOptions}
          selected={trackType}
          onChange={setTrackType}
          keyField="value"
          labelField="label"
        />
        <DialogSelect
          title="Track source"
          options={trackSourceOptions}
          selected={selectedSource}
          onChange={setSource}
          keyField="value"
          labelField="label"
        />
        <DialogRow>
          <Text variant="md">Track status</Text>
          <RadioGroup.Root value={enabled} onValueChange={setEnabled}>
            <Flex align="center" css={{ mr: "$8" }}>
              <RadioGroup.Item
                value={false}
                id="trackDisableRadio"
                css={{ mr: "$4" }}
              >
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <Label htmlFor="trackDisableRadio">Mute</Label>
            </Flex>
            <Flex align="center" css={{ cursor: "pointer" }}>
              <RadioGroup.Item
                value={true}
                id="trackEnableRadio"
                css={{ mr: "$4" }}
              >
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <Label htmlFor="trackEnableRadio">Request Unmute</Label>
            </Flex>
          </RadioGroup.Root>
        </DialogRow>
        <DialogRow justify="end">
          <Button variant="primary" onClick={muteAll}>
            Apply
          </Button>
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
};
