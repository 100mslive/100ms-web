import React, { useState } from "react";
import {
  useHMSStore,
  selectPeerByID,
  useHMSActions,
  selectAvailableRoleNames,
} from "@100mslive/react-sdk";
import { Dialog, Button } from "@100mslive/react-ui";
import { SettingIcon } from "@100mslive/react-icons";
import {
  DialogCheckbox,
  DialogContent,
  DialogRow,
  DialogSelect,
} from "../primitives/DialogContent";

export const RoleChangeModal = ({ peerId, onOpenChange }) => {
  const peer = useHMSStore(selectPeerByID(peerId));
  const roles = useHMSStore(selectAvailableRoleNames);
  const [selectedRole, setRole] = useState(peer?.roleName);
  const [requestPermission, setRequestPermission] = useState(true);
  const hmsActions = useHMSActions();
  return (
    <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
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
        {!peer.isLocal && (
          <DialogCheckbox
            title="Request Permission"
            value={requestPermission}
            onChange={setRequestPermission}
            id="requestRoleChangePermission"
          />
        )}
        <DialogRow justify="end">
          <Button
            variant="primary"
            onClick={async () => {
              await hmsActions.changeRole(
                peerId,
                selectedRole,
                peer.isLocal ? true : !requestPermission
              );
              onOpenChange(false);
            }}
          >
            Confirm
          </Button>
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
};
