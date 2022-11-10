import React from "react";
import {
  selectRoleChangeRequest,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { RequestDialog } from "../primitives/DialogContent";
import { useIsHeadless } from "./AppData/useUISettings";

export const RoleChangeRequestModal = () => {
  const hmsActions = useHMSActions();
  const isHeadless = useIsHeadless();
  const roleChangeRequest = useHMSStore(selectRoleChangeRequest);

  if (!roleChangeRequest?.role || isHeadless) {
    return null;
  }

  return (
    <RequestDialog
      title="Role Change Request"
      onOpenChange={value =>
        !value && hmsActions.rejectChangeRole(roleChangeRequest)
      }
      body={`${roleChangeRequest?.requestedBy?.name} has requested you to change your role to ${roleChangeRequest?.role?.name}.`}
      onAction={() => {
        hmsActions.acceptChangeRole(roleChangeRequest);
      }}
      actionText="Accept"
    />
  );
};
