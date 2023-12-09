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
        css={{ fontWeight: 400, c: "$on_surface_medium", textAlign: "center" }}
      >
        Setup your audio and video before joining
      </Text>
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
      title={`You're invited to join the ${roleChangeRequest.role.name} role`}
      onOpenChange={async value => {
        if (!value) {
          await hmsActions.rejectChangeRole(roleChangeRequest);
          await hmsActions.cancelMidCallPreview();
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
