import React, { useState } from "react";
import {
  useHMSStore,
  selectPeerByID,
  useHMSActions,
  selectAvailableRoleNames,
} from "@100mslive/react-sdk";
import {
  Dialog,
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  Button,
} from "@100mslive/react-ui";
import { CheckIcon, SettingIcon } from "@100mslive/react-icons";
import { DialogContent, DialogRow, DialogSelect } from "./DialogContent";

export const RoleChangeModal = ({ peerId, onClose }) => {
  const peer = useHMSStore(selectPeerByID(peerId));
  const roles = useHMSStore(selectAvailableRoleNames);
  const [selectedRole, setRole] = useState(peer?.roleName);
  const [forceChange, setForceChange] = useState(false);
  const hmsActions = useHMSActions();
  return (
    <Dialog defaultOpen onOpenChange={value => !value && onClose()}>
      <DialogContent
        Icon={SettingIcon}
        title={`User Settings (${peer?.name || "peer left"})`}
      >
        <DialogSelect
          title="Change role to"
          options={roles}
          selected={selectedRole}
          onChange={setRole}
        />
        <DialogRow>
          <CheckboxLabel htmlFor="permissionCheckbox">
            Don't ask for permissions:
          </CheckboxLabel>
          <Checkbox
            id="permissionCheckbox"
            onCheckedChange={value => setForceChange(value)}
          >
            <CheckboxIndicator>
              <CheckIcon width={16} height={16} />
            </CheckboxIndicator>
          </Checkbox>
        </DialogRow>
        <DialogRow justify="end">
          <Button
            variant="primary"
            onClick={async () => {
              await hmsActions.changeRole(peerId, selectedRole, forceChange);
              onClose();
            }}
          >
            Confirm
          </Button>
        </DialogRow>
      </DialogContent>
    </Dialog>
  );
};
