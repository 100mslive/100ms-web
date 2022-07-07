import React, {
  Fragment,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import { useVirtual } from "@tanstack/react-virtual";
import { useDebounce } from "react-use";
import {
  selectAudioTrackByPeerID,
  selectLocalPeerID,
  selectPeerCount,
  selectPeerMetadata,
  selectPermissions,
  useHMSActions,
  useHMSStore,
  useParticipants,
} from "@100mslive/react-sdk";
import {
  CrossIcon,
  ChangeRoleIcon,
  HandRaiseIcon,
  PeopleIcon,
  SearchIcon,
  VerticalMenuIcon,
  SpeakerIcon,
} from "@100mslive/react-icons";
import {
  Flex,
  Box,
  Text,
  Avatar,
  textEllipsis,
  IconButton,
  Input,
  Dropdown,
  Slider,
} from "@100mslive/react-ui";
import { RoleChangeModal } from "../RoleChangeModal";
import { ConnectionIndicator } from "../Connection/ConnectionIndicator";
import { ParticipantFilter } from "./ParticipantFilter";
import {
  useIsSidepaneTypeOpen,
  useSidepaneToggle,
} from "../AppData/useSidepane";
import { SIDE_PANE_OPTIONS } from "../../common/constants";

export const ParticipantList = () => {
  const [filter, setFilter] = useState();
  const { participants, isConnected, peerCount, rolesWithParticipants } =
    useParticipants(filter);
  const [selectedPeerId, setSelectedPeerId] = useState(null);
  const toggleSidepane = useSidepaneToggle(SIDE_PANE_OPTIONS.PARTICIPANTS);
  const onSearch = useCallback(value => {
    setFilter(filterValue => {
      if (!filterValue) {
        filterValue = {};
      }
      filterValue.search = value;
      return { ...filterValue };
    });
  }, []);
  if (peerCount === 0) {
    return null;
  }

  return (
    <Fragment>
      <Flex direction="column" css={{ size: "100%" }}>
        <Flex align="center" css={{ w: "100%", mb: "$10" }}>
          <Text css={{ fontWeight: "$semiBold", mr: "$4" }}>Participants</Text>
          <ParticipantFilter
            selection={filter}
            onSelection={setFilter}
            isConnected={isConnected}
            roles={rolesWithParticipants}
          />
          <IconButton
            onClick={toggleSidepane}
            css={{ w: "$11", h: "$11", ml: "auto" }}
          >
            <CrossIcon />
          </IconButton>
        </Flex>
        {!filter?.search && participants.length === 0 ? null : (
          <ParticipantSearch onSearch={onSearch} />
        )}
        {participants.length === 0 && (
          <Flex align="center" justify="center" css={{ w: "100%", p: "$8 0" }}>
            <Text variant="sm">
              {!filter ? "No participants" : "No matching participants"}
            </Text>
          </Flex>
        )}
        <VirtualizedParticipants
          participants={participants}
          isConnected={isConnected}
          setSelectedPeerId={setSelectedPeerId}
        />
      </Flex>
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

export const ParticipantCount = () => {
  const peerCount = useHMSStore(selectPeerCount);
  const toggleSidepane = useSidepaneToggle(SIDE_PANE_OPTIONS.PARTICIPANTS);
  const isParticipantsOpen = useIsSidepaneTypeOpen(
    SIDE_PANE_OPTIONS.PARTICIPANTS
  );
  useEffect(() => {
    if (isParticipantsOpen && peerCount === 0) {
      toggleSidepane();
    }
  }, [isParticipantsOpen, peerCount, toggleSidepane]);
  return (
    <IconButton
      onClick={() => {
        if (peerCount > 0) {
          toggleSidepane();
        }
      }}
      active={!isParticipantsOpen}
      data-testid="participant_list"
    >
      <PeopleIcon />
      {peerCount > 0 && (
        <Flex
          align="center"
          justify="center"
          css={{
            position: "absolute",
            top: 0,
            right: -8,
            zIndex: 2,
            transform: "translateY(-50%)",
            height: "$10",
            minWidth: "$10",
            bg: "$surfaceLight",
            borderRadius: "$4",
            color: "$textPrimary",
            fontSize: "$tiny",
          }}
        >
          {peerCount}
        </Flex>
      )}
    </IconButton>
  );
};

const VirtualizedParticipants = ({
  participants,
  isConnected,
  setSelectedPeerId,
}) => {
  const parentRef = useRef(null);
  const rowVirtualizer = useVirtual({
    size: participants.length,
    parentRef,
    estimateSize: useCallback(() => 60, []),
  });

  return (
    <Box
      ref={parentRef}
      css={{ flex: "1 1 0", overflowY: "auto", mr: "-$10", pr: "$10" }}
    >
      <div
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.virtualItems.map(virtualRow => (
          <div
            key={virtualRow.index}
            ref={virtualRow.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <Participant
              peer={participants[virtualRow.index]}
              key={participants[virtualRow.index].id}
              showActions={isConnected}
              onParticipantAction={setSelectedPeerId}
            />
          </div>
        ))}
      </div>
    </Box>
  );
};

const Participant = ({
  peer,
  canChangeRole,
  showActions,
  onParticipantAction,
}) => {
  return (
    <Flex
      key={peer.id}
      css={{ w: "100%", py: "$4" }}
      align="center"
      data-testid={"participant_" + peer.name}
    >
      <Avatar
        name={peer.name}
        css={{
          position: "unset",
          transform: "unset",
          mr: "$8",
          fontSize: "$sm",
          size: "$12",
          p: "$4",
        }}
      />
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
    </Flex>
  );
};

/**
 * shows settings to change for a participant like changing their role
 */
const ParticipantActions = React.memo(({ onSettings, peerId }) => {
  const isHandRaised = useHMSStore(selectPeerMetadata(peerId))?.isHandRaised;
  const canChangeRole = useHMSStore(selectPermissions)?.changeRole;
  const audioTrack = useHMSStore(selectAudioTrackByPeerID(peerId));
  const localPeerId = useHMSStore(selectLocalPeerID);
  const canChangeVolume = peerId !== localPeerId && audioTrack;
  const shouldShowMoreActions = canChangeRole || canChangeVolume;

  return (
    <Flex align="center" css={{ flexShrink: 0 }}>
      <ConnectionIndicator peerId={peerId} />
      {isHandRaised && <HandRaiseIcon />}
      {shouldShowMoreActions && (
        <ParticipantMoreActions onRoleChange={onSettings} peerId={peerId} />
      )}
    </Flex>
  );
});

const ParticipantMoreActions = ({ onRoleChange, peerId }) => {
  const canChangeRole = useHMSStore(selectPermissions)?.changeRole;
  const [open, setOpen] = useState(false);
  return (
    <Dropdown.Root open={open} onOpenChange={value => setOpen(value)}>
      <Dropdown.Trigger
        asChild
        data-testid="participant_more_actions"
        css={{ p: "$2", r: "$0" }}
        tabIndex={0}
      >
        <Text>
          <VerticalMenuIcon />
        </Text>
      </Dropdown.Trigger>
      <Dropdown.Content align="start" sideOffset={8}>
        {canChangeRole && (
          <Dropdown.Item onClick={() => onRoleChange(peerId)}>
            <ChangeRoleIcon />
            <Text css={{ ml: "$4" }}>Change Role</Text>
          </Dropdown.Item>
        )}
        <ParticipantVolume peerId={peerId} />
      </Dropdown.Content>
    </Dropdown.Root>
  );
};

const ParticipantVolume = ({ peerId }) => {
  const audioTrack = useHMSStore(selectAudioTrackByPeerID(peerId));
  const localPeerId = useHMSStore(selectLocalPeerID);
  const hmsActions = useHMSActions();
  // No volume control for local peer or non audio publishing role
  if (peerId === localPeerId || !audioTrack) {
    return null;
  }

  return (
    <Dropdown.Item css={{ h: "auto" }}>
      <Flex direction="column" css={{ w: "100%" }}>
        <Flex align="center">
          <SpeakerIcon />
          <Text css={{ ml: "$4" }}>
            Volume{audioTrack.volume ? `(${audioTrack.volume})` : ""}
          </Text>
        </Flex>
        <Slider
          css={{ my: "0.5rem" }}
          step={5}
          value={[audioTrack.volume]}
          onValueChange={e => {
            hmsActions.setVolume(e[0], audioTrack?.id);
          }}
        />
      </Flex>
    </Dropdown.Item>
  );
};

export const ParticipantSearch = ({ onSearch, placeholder }) => {
  const [value, setValue] = React.useState("");
  useDebounce(
    () => {
      onSearch(value);
    },
    300,
    [value, onSearch]
  );
  return (
    <Box css={{ p: "$4 0", my: "$8", position: "relative" }}>
      <Box
        css={{
          position: "absolute",
          left: "$4",
          top: "$2",
          transform: "translateY(50%)",
          color: "$textMedEmp",
        }}
      >
        <SearchIcon />
      </Box>
      <Input
        type="text"
        placeholder={placeholder || "Find what you are looking for"}
        css={{ w: "100%", pl: "$14" }}
        value={value}
        onKeyDown={event => {
          event.stopPropagation();
        }}
        onChange={event => {
          setValue(event.currentTarget.value);
        }}
      />
    </Box>
  );
};
