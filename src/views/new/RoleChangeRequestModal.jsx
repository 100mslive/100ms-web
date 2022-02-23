import React, { useContext } from "react";
import {
  useHMSActions,
  selectRoleChangeRequest,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Dialog, Button, Text } from "@100mslive/react-ui";
import { DialogContent, DialogRow } from "./DialogContent";
import { AppContext } from "../../store/AppContext";

export const RoleChangeRequestModal = () => {
  const hmsActions = useHMSActions();
  const { isHeadless } = useContext(AppContext);
  const roleChangeRequest = useHMSStore(selectRoleChangeRequest);

  return (
    <Dialog.Root open={roleChangeRequest?.role && !isHeadless}>
      <DialogContent title="Role Change Request">
        <DialogRow>
          <Text variant="md">
            Role change requested by {roleChangeRequest?.requestedBy?.name}.
            Changing role to {roleChangeRequest?.role?.name}.
          </Text>
        </DialogRow>
        <DialogRow justify="end">
          <Button
            variant="primary"
            onClick={() => {
              hmsActions.acceptChangeRole(roleChangeRequest);
            }}
          >
            Accept
          </Button>
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
};
