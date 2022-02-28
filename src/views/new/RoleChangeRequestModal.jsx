import React, { useContext } from "react";
import {
  useHMSActions,
  selectRoleChangeRequest,
  useHMSStore,
} from "@100mslive/react-sdk";
import { RequestDialog } from "./DialogContent";
import { AppContext } from "../../store/AppContext";
import { PersonIcon } from "@100mslive/react-icons";

export const RoleChangeRequestModal = () => {
  const hmsActions = useHMSActions();
  const { isHeadless } = useContext(AppContext);
  const roleChangeRequest = useHMSStore(selectRoleChangeRequest);

  if (!roleChangeRequest?.role && !isHeadless) {
    return null;
  }

  return (
    <RequestDialog
      title="Role Change Request"
      onOpenChange={value =>
        !value && hmsActions.rejectChangeRole(roleChangeRequest)
      }
      body={`Role change requested by ${roleChangeRequest?.requestedBy?.name}.
      Changing role to ${roleChangeRequest?.role?.name}.`}
      onAction={() => {
        hmsActions.acceptChangeRole(roleChangeRequest);
      }}
      Icon={PersonIcon}
    />
  );
};
