import React, { useContext, useMemo } from "react";
import { useMedia } from "react-use";
import {
  selectAvailableRoleNames,
  selectLocalPeerID,
  selectLocalPeerRole,
  selectPermissions,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { ArrowRightIcon, CheckIcon, PersonIcon } from "@100mslive/react-icons";
import { Dropdown, Text, config } from "@100mslive/react-ui";
import { arrayIntersection } from "../../common/utils";
import { AppContext } from "../context/AppContext";
import { ToastManager } from "../Toast/ToastManager";

export const ChangeSelfRole = ({ css, onClick }) => {
  const roles = useHMSStore(selectAvailableRoleNames);
  const permissions = useHMSStore(selectPermissions);
  const localPeerId = useHMSStore(selectLocalPeerID);
  const localPeerRole = useHMSStore(selectLocalPeerRole);
  const hmsActions = useHMSActions();
  const hideTriggerItem = useMedia(config.media.sm);
  const {
    appPolicyConfig: { selfRoleChangeTo },
  } = useContext(AppContext);

  const availableSelfChangeRoles = useMemo(
    () => arrayIntersection(selfRoleChangeTo, roles),
    [roles, selfRoleChangeTo]
  );

  if (!permissions.changeRole) {
    return null;
  }
  return hideTriggerItem ? (
    <Dropdown.Item css={css} onClick={onClick}>
      <PersonIcon />
      <Text variant="sm" css={{ mx: "$4" }}>
        Change My Role
      </Text>
    </Dropdown.Item>
  ) : (
    <Dropdown.Root>
      <Dropdown.TriggerItem css={css} data-testid="change_my_role_btn">
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
            css={{ ...css, justifyContent: "space-between" }}
            onClick={async () => {
              try {
                await hmsActions.changeRole(localPeerId, role, true);
              } catch (error) {
                ToastManager.addToast({ title: error.message });
              }
            }}
            data-testid={"change_to_role_" + i}
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
