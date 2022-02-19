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
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MicOffIcon,
  MicOnIcon,
  PeopleIcon,
  SettingIcon,
} from "@100mslive/react-icons";
import {
  selectIsPeerAudioEnabled,
  selectPermissions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { useParticipantList } from "../hooks/useParticipantList";
import { RoleChangeModal } from "./RoleChangeModal";

const ParticipantActions = React.memo(({ peerId, onSettings }) => {
  const permissions = useHMSStore(selectPermissions);
  const isAudioEnabled = useHMSStore(selectIsPeerAudioEnabled(peerId));

  return (
    <Fragment>
      <Flex align="center">
        {permissions?.changeRole && (
          <IconButton css={{ mr: "$2" }} onClick={() => onSettings(peerId)}>
            <SettingIcon />
          </IconButton>
        )}
        {isAudioEnabled ? <MicOnIcon /> : <MicOffIcon />}
      </Flex>
    </Fragment>
  );
});

export const ParticipantList = () => {
  const { roles, participantsByRoles, peerCount } = useParticipantList();
  const [open, setOpen] = useState(false);
  const [selectedPeerId, setSelectedPeerId] = useState(null);
  return (
    <Fragment>
      <Dropdown open={open} onOpenChange={value => setOpen(value)}>
        <DropdownTrigger asChild>
          <Flex
            css={{
              color: "$textPrimary",
              "@md": {
                borderRadius: "$1",
                border: "1px solid $textPrimary",
              },
            }}
          >
            <Box
              css={{ display: "none", "@md": { display: "block", mr: "$2" } }}
            >
              <PeopleIcon />
            </Box>
            <Text variant="md">{peerCount}</Text>
            <Flex align="center" css={{ "@md": { display: "none" } }}>
              <Text variant="md" css={{ mr: "$2" }}>
                &nbsp;in room
              </Text>
              {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </Flex>
          </Flex>
        </DropdownTrigger>
        <DropdownContent
          sideOffset={5}
          align="end"
          css={{ height: "auto", maxHeight: "$96" }}
        >
          {roles.map(role => {
            if (!participantsByRoles[role]) {
              return null;
            }
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
                <DropdownLabel css={{ h: "$14" }}>
                  <Text variant="md" css={{ pl: "$8" }}>
                    {role}({participants.length})
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
                          fontSize: "12px",
                        }}
                      />
                      <Text
                        variant="md"
                        css={{ ...textEllipsis(150), flex: "1 1 0" }}
                      >
                        {peer.name}
                      </Text>
                      <ParticipantActions
                        peerId={peer.id}
                        onSettings={peerId => {
                          setSelectedPeerId(peerId);
                        }}
                      />
                    </DropdownItem>
                  );
                })}
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
