import React, { useMemo } from "react";
import { useMedia } from "react-use";
import {
  selectAvailableRoleNames,
  selectLocalPeerID,
  selectLocalPeerRoleName,
  selectPermissions,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { ArrowRightIcon, CheckIcon, PersonIcon } from "@100mslive/react-icons";
import { Dropdown, Text, config } from "@100mslive/react-ui";
import { ToastManager } from "../Toast/ToastManager";
import { useAppLayout } from "../AppData/useAppLayout";
import { arrayIntersection } from "../../common/utils";

export const ChangeSelfRole = ({ onClick }) => {
  const roles = useHMSStore(selectAvailableRoleNames);
  const permissions = useHMSStore(selectPermissions);
  const localPeerId = useHMSStore(selectLocalPeerID);
  const localPeerRole = useHMSStore(selectLocalPeerRoleName);
  const hmsActions = useHMSActions();
  const hideTriggerItem = useMedia(config.media.sm);
  const selfRoleChangeTo = useAppLayout("selfRoleChangeTo");
  const availableSelfChangeRoles = useMemo(
    () => arrayIntersection(selfRoleChangeTo, roles),
    [roles, selfRoleChangeTo]
  );

  if (!permissions.changeRole) {
    return null;
  }
  return hideTriggerItem ? (
    <Dropdown.Item onClick={onClick}>
      <PersonIcon />
      <Text variant="sm" css={{ mx: "$4" }}>
        Change My Role
      </Text>
    </Dropdown.Item>
  ) : (
    <Dropdown.Root>
      <Dropdown.TriggerItem data-testid="change_my_role_btn">
        <PersonIcon />
        <Text variant="sm" css={{ flex: "1 1 0", mx: "$4" }}>
          Change My Role
        </Text>
        <ArrowRightIcon />
      </Dropdown.TriggerItem>
      <Dropdown.Content
        sideOffset={2}
        alignOffset={-5}
        css={{ maxHeight: "$64" }}
      >
        {availableSelfChangeRoles.map((role, i) => (
          <Dropdown.Item
            key={role}
            css={{ justifyContent: "space-between" }}
            onClick={async () => {
              try {
                await hmsActions.changeRole(localPeerId, role, true);
              } catch (error) {
                ToastManager.addToast({ title: error.message });
              }
            }}
            data-testid={"change_to_role_" + role}
          >
            <Text variant="sm">{role}</Text>
            {localPeerRole === role && <CheckIcon width={16} height={16} />}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
};
