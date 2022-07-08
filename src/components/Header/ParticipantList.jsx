import React, { Fragment, useState } from "react";
import { FixedSizeList } from "react-window";
import {
  Dropdown,
  Flex,
  Box,
  Text,
  Avatar,
  textEllipsis,
  IconButton,
  Tooltip,
} from "@100mslive/react-ui";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  HandRaiseIcon,
  PeopleIcon,
  SettingIcon,
} from "@100mslive/react-icons";
import {
  selectPeerMetadata,
  selectPermissions,
  useHMSStore,
  useParticipants,
} from "@100mslive/react-sdk";
import { RoleChangeModal } from "../RoleChangeModal";
import { ConnectionIndicator } from "../Connection/ConnectionIndicator";
import { ParticipantFilter } from "./ParticipantFilter";

export const ParticipantList = () => {
  const [filter, setFilter] = useState();
  const { participants, isConnected, peerCount, rolesWithParticipants } =
    useParticipants(filter);
  const [open, setOpen] = useState(false);
  const [selectedPeerId, setSelectedPeerId] = useState(null);
  const canChangeRole = useHMSStore(selectPermissions)?.changeRole;
  if (peerCount === 0) {
    return null;
  }

  return (
    <Fragment>
      <Dropdown.Root open={open} onOpenChange={value => setOpen(value)}>
        <Dropdown.Trigger asChild data-testid="participant_list">
          <Flex
            css={{
              color: "$textPrimary",
              borderRadius: "$1",
              border: "1px solid $textDisabled",
              padding: "$2 $4",
            }}
          >
            <Tooltip title="Participant List">
              <Flex>
                <ParticipantCount peerCount={peerCount} />
                {participants.length > 0 && (
                  <Box
                    css={{
                      ml: "$2",
                      "@lg": { display: "none" },
                      color: "$textDisabled",
                    }}
                  >
                    {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  </Box>
                )}
              </Flex>
            </Tooltip>
          </Flex>
        </Dropdown.Trigger>
        <Dropdown.Content
          sideOffset={5}
          align="end"
          css={{
            w: "$72",
            height: "auto",
            maxHeight: "$96",
            overflowY: "hidden",
          }}
        >
          <Flex
            align="center"
            justify="between"
            css={{ w: "100%", p: "$4 $8" }}
          >
            <Text css={{ flex: "1 1 0", fontWeight: "$semiBold" }}>
              Participants
            </Text>
            <ParticipantFilter
              selection={filter}
              onSelection={setFilter}
              isConnected={isConnected}
              roles={rolesWithParticipants}
            />
          </Flex>
          {participants.length === 0 && (
            <Flex
              align="center"
              justify="center"
              css={{ w: "100%", p: "$8 0" }}
            >
              <Text variant="sm">
                {!filter ? "No participants" : "No matching participants"}
              </Text>
            </Flex>
          )}
          <VirtualizedParticipants
            participants={participants}
            canChangeRole={canChangeRole}
            isConnected={isConnected}
            setSelectedPeerId={setSelectedPeerId}
          />
        </Dropdown.Content>
      </Dropdown.Root>
      {selectedPeerId && (
        <RoleChangeModal
          peerId={selectedPeerId}
          onOpenChange={value => {
            !value && setSelectedPeerId(null);
          }}
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

const PARTICIPANT_ROW_HEIGHT = 68;
// $96 => 24rem => 384px
const PARTICIPANT_LIST_MAX_HEIGHT =
  24 * parseFloat(getComputedStyle(document.documentElement).fontSize);

const VirtualizedParticipants = ({
  participants,
  canChangeRole,
  isConnected,
  setSelectedPeerId,
}) => {
  return (
    <FixedSizeList
      itemSize={68}
      itemCount={participants.length}
      width="100%"
      height={Math.min(
        PARTICIPANT_LIST_MAX_HEIGHT,
        participants.length * PARTICIPANT_ROW_HEIGHT
      )}
    >
      {({ index, style }) => {
        return (
          <div style={style} key={participants[index].id}>
            <Participant
              peer={participants[index]}
              canChangeRole={canChangeRole}
              showActions={isConnected}
              onParticipantAction={setSelectedPeerId}
            />
          </div>
        );
      }}
    </FixedSizeList>
  );
};

const Participant = ({
  peer,
  canChangeRole,
  showActions,
  onParticipantAction,
}) => {
  return (
    <Dropdown.Item
      key={peer.id}
      css={{ w: "100%", h: "$19" }}
      data-testid={"participant_" + peer.name}
    >
      <Box css={{ width: "$16", flexShrink: 0 }}>
        <Avatar
          name={peer.name}
          css={{
            position: "unset",
            transform: "unset",
            mr: "$4",
            fontSize: "$sm",
          }}
        />
      </Box>
      <Flex direction="column" css={{ flex: "1 1 0" }}>
        <Text
          variant="md"
          css={{ ...textEllipsis(150), fontWeight: "$semiBold" }}
        >
          {peer.name}
        </Text>
        <Text variant="sub2">{peer.roleName}</Text>
      </Flex>
      {showActions && (
        <ParticipantActions
          peerId={peer.id}
          onSettings={() => {
            onParticipantAction(peer.id);
          }}
          canChangeRole={canChangeRole}
        />
      )}
    </Dropdown.Item>
  );
};

/**
 * shows settings to change for a participant like changing their role
 */
const ParticipantActions = React.memo(
  ({ canChangeRole, onSettings, peerId }) => {
    const isHandRaised = useHMSStore(selectPeerMetadata(peerId))?.isHandRaised;
    return (
      <Flex align="center" css={{ flexShrink: 0 }}>
        <ConnectionIndicator peerId={peerId} />
        {isHandRaised && <HandRaiseIcon />}
        {canChangeRole && (
          <IconButton onClick={onSettings}>
            <SettingIcon />
          </IconButton>
        )}
      </Flex>
    );
  }
);
