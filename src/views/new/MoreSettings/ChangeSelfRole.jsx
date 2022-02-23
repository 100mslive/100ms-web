import { ArrowRightIcon, CheckIcon, PersonIcon } from "@100mslive/react-icons";
import {
  selectAvailableRoleNames,
  selectLocalPeerID,
  selectLocalPeerRole,
  selectPermissions,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Dropdown, Flex, Text } from "@100mslive/react-ui";
import React, { useContext, useMemo } from "react";
import { arrayIntersection } from "../../../common/utils";
import { AppContext } from "../../../store/AppContext";

export const ChangeSelfRole = ({ css }) => {
  const roles = useHMSStore(selectAvailableRoleNames);
  const permissions = useHMSStore(selectPermissions);
  const localPeerId = useHMSStore(selectLocalPeerID);
  const localPeerRole = useHMSStore(selectLocalPeerRole);
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
      <Dropdown.TriggerItem css={css}>
        <Flex css={{ color: "$textPrimary", w: "100%" }}>
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
        css={{ maxHeight: "$64" }}
      >
        {availableSelfChangeRoles.map(role => (
          <Dropdown.Item
            key={role}
            css={{ ...css, justifyContent: "space-between" }}
            onClick={async () => {
              try {
                await hmsActions.changeRole(localPeerId, role, true);
              } catch (error) {
                hmsToast(error.message);
              }
            }}
          >
            <Text variant="sm">{role}</Text>
            {localPeerRole.name === role && (
              <CheckIcon width={16} height={16} />
            )}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
};
