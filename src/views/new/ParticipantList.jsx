import React, { Fragment, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownGroup,
  DropdownLabel,
  Flex,
  Box,
  Text,
  Avatar,
  textEllipsis,
  IconButton,
} from "@100mslive/react-ui";
import { PeopleIcon, SettingIcon } from "@100mslive/react-icons";
import { selectPermissions, useHMSStore } from "@100mslive/react-sdk";
import { useParticipantList } from "../hooks/useParticipantList";
import { RoleChangeModal } from "./RoleChangeModal";

export const ParticipantList = () => {
  const { roles, participantsByRoles, peerCount, isConnected } =
    useParticipantList();
  const [open, setOpen] = useState(false);
  const [selectedPeerId, setSelectedPeerId] = useState(null);
  const canChangeRole = useHMSStore(selectPermissions)?.changeRole;
  if (peerCount === 0) {
    return null;
  }

  return (
    <Fragment>
      <Dropdown open={open} onOpenChange={value => setOpen(value)}>
        <DropdownTrigger asChild>
          <Flex
            css={{
              color: "$textPrimary",
              borderRadius: "$1",
              border: "1px solid $previewBg",
            }}
          >
            <ParticipantCount peerCount={peerCount} />
          </Flex>
        </DropdownTrigger>
        <DropdownContent
          sideOffset={5}
          align="end"
          css={{ height: "auto", maxHeight: "$96" }}
        >
          {roles.map(role => {
            const participants = participantsByRoles[role];
            return (
              <DropdownGroup
                css={{
                  h: "auto",
                  flexDirection: "column",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                }}
                key={role}
              >
                <ParticipantListInARole
                  roleName={role}
                  participants={participants}
                  canChangeRole={canChangeRole}
                  showActions={isConnected}
                  onParticipantAction={setSelectedPeerId}
                />
              </DropdownGroup>
            );
          })}
        </DropdownContent>
      </Dropdown>
      {selectedPeerId && (
        <RoleChangeModal
          peerId={selectedPeerId}
          onClose={() => setSelectedPeerId(null)}
        />
      )}
    </Fragment>
  );
};

const ParticipantCount = React.memo(({ peerCount }) => {
  return (
    <>
      <Box css={{ display: "block", mr: "$2" }}>
        <PeopleIcon />
      </Box>
      <Text variant="md">{peerCount}</Text>
    </>
  );
});

/**
 * list of all peers for the role
 */
const ParticipantListInARole = ({
  roleName,
  participants,
  showActions,
  onParticipantAction,
  canChangeRole,
}) => {
  return (
    <>
      <DropdownLabel css={{ h: "$14" }}>
        <Text variant="md" css={{ pl: "$8" }}>
          {roleName}({participants.length})
        </Text>
      </DropdownLabel>
      {participants.map(peer => {
        return (
          <DropdownItem key={peer.id} css={{ w: "100%", h: "$14" }}>
            <Avatar
              shape="square"
              name={peer.name}
              css={{
                position: "unset",
                transform: "unset",
                mr: "$4",
                fontSize: "$sm",
              }}
            />
            <Text variant="md" css={{ ...textEllipsis(150), flex: "1 1 0" }}>
              {peer.name}
            </Text>
            {showActions && (
              <ParticipantActions
                peerId={peer.id}
                onSettings={() => {
                  onParticipantAction(peer.id);
                }}
                canChangeRole={canChangeRole}
              />
            )}
          </DropdownItem>
        );
      })}
    </>
  );
};

/**
 * shows settings to change for a participant like changing their role
 */
const ParticipantActions = React.memo(({ canChangeRole, onSettings }) => {
  return (
    <Fragment>
      <Flex align="center">
        {canChangeRole && (
          <IconButton onClick={onSettings}>
            <SettingIcon />
          </IconButton>
        )}
      </Flex>
    </Fragment>
  );
});
