import React, { useState } from "react";
import {
  useHMSStore,
  selectPeerByID,
  useHMSActions,
  selectAvailableRoleNames,
} from "@100mslive/react-sdk";
import {
  Dialog,
  Flex,
  Text,
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  Button,
  Select,
} from "@100mslive/react-ui";
import { CheckIcon, SettingIcon } from "@100mslive/react-icons";

export const RoleChangeModal = ({ peerId, onClose }) => {
  const peer = useHMSStore(selectPeerByID(peerId));
  const roles = useHMSStore(selectAvailableRoleNames);
  const [selectedRole, setRole] = useState(peer.roleName);
  const [forceChange, setForceChange] = useState(false);
  const hmsActions = useHMSActions();
  return (
    <Dialog defaultOpen onOpenChange={value => !value && onClose()}>
      <Dialog.Content
        title={
          <Flex align="center">
            <SettingIcon />
            &nbsp;User Settings ({peer.name})
          </Flex>
        }
      >
        <Flex align="center" css={{ px: "$4", mt: "$8" }}>
          <Text size="md" css={{ mr: "$8" }}>
            Change role to:
          </Text>
          <Select
            value={selectedRole}
            onChange={event => {
              setRole(event.target.value);
            }}
          >
            {roles.map(role => {
              return (
                <option key={role} value={role}>
                  {role}
                </option>
              );
            })}
          </Select>
        </Flex>
        <Flex align="center" css={{ px: "$4", mt: "$4" }}>
          <Checkbox
            id="permissionCheckbox"
            onCheckedChange={value => setForceChange(value)}
          >
            <CheckboxIndicator>
              <CheckIcon width={16} height={16} />
            </CheckboxIndicator>
          </Checkbox>
          <CheckboxLabel htmlFor="permissionCheckbox">
            Don't ask for permissions
          </CheckboxLabel>
        </Flex>
        <Flex justify="end" css={{ mt: "$8" }}>
          <Button
            variant="primary"
            onClick={async () => {
              await hmsActions.changeRole(peerId, selectedRole, forceChange);
              onClose();
            }}
          >
            Confirm
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog>
  );
};
