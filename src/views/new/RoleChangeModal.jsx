import React, { useState } from "react";
import {
  useHMSStore,
  selectPeerByID,
  useHMSActions,
  selectAvailableRoleNames,
} from "@100mslive/react-sdk";
import { Dialog, Label, Checkbox, Button } from "@100mslive/react-ui";
import { CheckIcon, SettingIcon } from "@100mslive/react-icons";
import { DialogContent, DialogRow, DialogSelect } from "./DialogContent";

export const RoleChangeModal = ({ peerId, onClose }) => {
  const peer = useHMSStore(selectPeerByID(peerId));
  const roles = useHMSStore(selectAvailableRoleNames);
  const [selectedRole, setRole] = useState(peer?.roleName);
  const [requestPermission, setRequestPermission] = useState(true);
  const hmsActions = useHMSActions();
  return (
    <Dialog.Root defaultOpen onOpenChange={value => !value && onClose()}>
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
          <Label htmlFor="permissionCheckbox">Request Permission:</Label>
          <Checkbox.Root
            id="permissionCheckbox"
            checked={requestPermission}
            onCheckedChange={value => setRequestPermission(value)}
          >
            <Checkbox.Indicator>
              <CheckIcon width={16} height={16} />
            </Checkbox.Indicator>
          </Checkbox.Root>
        </DialogRow>
        <DialogRow justify="end">
          <Button
            variant="primary"
            onClick={async () => {
              await hmsActions.changeRole(
                peerId,
                selectedRole,
                !requestPermission
              );
              onClose();
            }}
          >
            Confirm
          </Button>
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
};
