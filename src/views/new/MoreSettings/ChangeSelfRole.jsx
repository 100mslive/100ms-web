import { ArrowRightIcon, PersonIcon } from "@100mslive/react-icons";
import {
  selectAvailableRoleNames,
  selectLocalPeerID,
  selectPermissions,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Dropdown, Flex, Text } from "@100mslive/react-ui";
import React, { useContext, useMemo } from "react";
import { arrayIntersection } from "../../../common/utils";
import { AppContext } from "../../../store/AppContext";

export const ChangeSelfRole = () => {
  const roles = useHMSStore(selectAvailableRoleNames);
  const permissions = useHMSStore(selectPermissions);
  const localPeerId = useHMSStore(selectLocalPeerID);
  const hmsActions = useHMSActions();
  const {
    hmsToast,
    appPolicyConfig: { selfRoleChangeTo },
  } = useContext(AppContext);

  const availableSelfChangeRoles = useMemo(
    () => arrayIntersection(selfRoleChangeTo, roles),
    [roles, selfRoleChangeTo]
  );

  if (!permissions.changeRole) {
    return null;
  }
  return (
    <Dropdown.Root>
      <Dropdown.TriggerItem asChild>
        <Flex css={{ color: "$textPrimary" }}>
          <PersonIcon />
          <Text variant="sm" css={{ flex: "1 1 0", mx: "$4" }}>
            Change My Role
          </Text>
          <ArrowRightIcon />
        </Flex>
      </Dropdown.TriggerItem>
      <Dropdown.Content
        sideOffset={2}
        alignOffset={-5}
        css={{ maxHeight: "unset" }}
      >
        {availableSelfChangeRoles.map(role => (
          <Dropdown.Item
            key={role}
            onClick={async () => {
              try {
                await hmsActions.changeRole(localPeerId, role, true);
              } catch (error) {
                hmsToast(error.message);
              }
            }}
          >
            {role}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
};
