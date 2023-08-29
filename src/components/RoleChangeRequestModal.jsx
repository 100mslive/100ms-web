import React, { useEffect } from "react";
import {
  selectLocalPeerName,
  selectRoleChangeRequest,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Flex, Text } from "@100mslive/roomkit-react";
import { PreviewControls, PreviewTile } from "./Preview/PreviewJoin";
import { RequestDialog } from "../primitives/DialogContent";
import { useIsHeadless } from "./AppData/useUISettings";

export const RoleChangeRequestModal = () => {
  const hmsActions = useHMSActions();
  const isHeadless = useIsHeadless();
  const roleChangeRequest = useHMSStore(selectRoleChangeRequest);
  const name = useHMSStore(selectLocalPeerName);

  useEffect(() => {
    if (!roleChangeRequest?.role || isHeadless) {
      return;
    }

    hmsActions.preview({ asRole: roleChangeRequest.role.name });
  }, [hmsActions, roleChangeRequest, isHeadless]);

  if (!roleChangeRequest?.role || isHeadless) {
    return null;
  }

  const body = (
    <>
      <Text
        css={{ fontWeight: 400, c: "$on_surface_medium" }}
      >{`${roleChangeRequest?.requestedBy?.name} has requested you to change your role to ${roleChangeRequest?.role?.name}.`}</Text>
      <Flex
        align="center"
        justify="center"
        css={{
          "@sm": { width: "100%" },
          flexDirection: "column",
        }}
      >
        <PreviewTile name={name} />
        <PreviewControls />
      </Flex>
    </>
  );

  return (
    <RequestDialog
      title="Role Change Request"
      onOpenChange={value => {
        if (!value) {
          hmsActions.cancelMidCallPreview();
          hmsActions.rejectChangeRole(roleChangeRequest);
        }
      }}
      body={body}
      onAction={() => {
        hmsActions.acceptChangeRole(roleChangeRequest);
      }}
      actionText="Accept"
    />
  );
};
