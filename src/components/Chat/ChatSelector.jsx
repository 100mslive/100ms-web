import React, { Fragment, useMemo, useState } from "react";
import { useMeasure } from "react-use";
import { FixedSizeList } from "react-window";
import {
  selectMessagesUnreadCountByPeerID,
  selectMessagesUnreadCountByRole,
  selectRemotePeers,
  selectUnreadHMSMessagesCount,
  useHMSStore,
} from "@100mslive/react-sdk";
import { CheckIcon } from "@100mslive/react-icons";
import {
  Box,
  Dropdown,
  Flex,
  HorizontalDivider,
  Text,
  Tooltip,
} from "@100mslive/react-ui";
import { ParticipantSearch } from "../Header/ParticipantList";
import { useFilteredRoles } from "../../common/hooks";

const ChatDotIcon = () => {
  return (
    <Box css={{ size: "$6", bg: "$brandDefault", mx: "$2", r: "$round" }} />
  );
};

const SelectorItem = ({ value, active, onClick, unreadCount }) => {
  return (
    <Dropdown.Item
      data-testid="chat_members"
      css={{ align: "center", px: "$10" }}
      onClick={onClick}
    >
      <Text variant="sm">{value}</Text>
      <Flex align="center" css={{ ml: "auto", color: "$textPrimary" }}>
        {unreadCount > 0 && (
          <Tooltip title={`${unreadCount} unread`}>
            <Box css={{ mr: active ? "$3" : 0 }}>
              <ChatDotIcon />
            </Box>
          </Tooltip>
        )}
        {active && <CheckIcon width={16} height={16} />}
      </Flex>
    </Dropdown.Item>
  );
};

const SelectorHeader = React.memo(({ children }) => {
  return (
    <Box css={{ flexShrink: 0 }}>
      <HorizontalDivider space={4} />
      <Text variant="md" css={{ p: "$4 $10", fontWeight: "$semiBold" }}>
        {children}
      </Text>
    </Box>
  );
});

const Everyone = React.memo(({ onSelect, active }) => {
  const unreadCount = useHMSStore(selectUnreadHMSMessagesCount);
  return (
    <SelectorItem
      value="Everyone"
      active={active}
      unreadCount={unreadCount}
      onClick={() => {
        onSelect({ role: "", peerId: "", selection: "Everyone" });
      }}
    />
  );
});

const RoleItem = React.memo(({ onSelect, role, active }) => {
  const unreadCount = useHMSStore(selectMessagesUnreadCountByRole(role));
  return (
    <SelectorItem
      value={role}
      active={active}
      unreadCount={unreadCount}
      onClick={() => {
        onSelect({ role: role, selection: role });
      }}
    />
  );
});

const PeerItem = ({ onSelect, peerId, name, active }) => {
  const unreadCount = useHMSStore(selectMessagesUnreadCountByPeerID(peerId));
  return (
    <SelectorItem
      value={name}
      active={active}
      unreadCount={unreadCount}
      onClick={() => {
        onSelect({ role: "", peerId, selection: name });
      }}
    />
  );
};

const VirtualizedSelectItemList = ({
  peers,
  selectedRole,
  selectedPeerId,
  searchValue,
  onSelect,
}) => {
  const [ref, { width, height }] = useMeasure();
  const roles = useFilteredRoles();
  const filteredPeers = useMemo(
    () =>
      peers.filter(
        // search should be empty or search phrase should be included in name
        peer =>
          !searchValue ||
          peer.name.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [peers, searchValue]
  );

  const listItems = useMemo(() => {
    const selectItems = [
      <Everyone
        onSelect={onSelect}
        active={!selectedRole && !selectedPeerId}
      />,
    ];

    roles.length > 0 &&
      selectItems.push(<SelectorHeader>Roles</SelectorHeader>);
    roles.forEach(userRole =>
      selectItems.push(
        <RoleItem
          key={userRole}
          active={selectedRole === userRole}
          role={userRole}
          onSelect={onSelect}
        />
      )
    );

    filteredPeers.length > 0 &&
      selectItems.push(<SelectorHeader>Participants</SelectorHeader>);
    filteredPeers.forEach(peer =>
      selectItems.push(
        <PeerItem
          key={peer.id}
          name={peer.name}
          peerId={peer.id}
          active={peer.id === selectedPeerId}
          onSelect={onSelect}
        />
      )
    );

    return selectItems;
  }, [onSelect, selectedRole, selectedPeerId, roles, filteredPeers]);

  return (
    <Dropdown.Group ref={ref} css={{ height: "$64", overflowY: "auto" }}>
      <FixedSizeList
        itemSize={52}
        itemCount={listItems.length}
        width={width}
        height={height}
      >
        {({ index, style }) => (
          <div style={style} key={index}>
            {listItems[index]}
          </div>
        )}
      </FixedSizeList>
    </Dropdown.Group>
  );
};

export const ChatSelector = ({ role, peerId, onSelect }) => {
  const peers = useHMSStore(selectRemotePeers);
  const [search, setSearch] = useState("");

  return (
    <Fragment>
      {peers.length > 0 && (
        <Box css={{ px: "$8" }}>
          <ParticipantSearch
            onSearch={setSearch}
            placeholder="Search participants"
          />
        </Box>
      )}
      <VirtualizedSelectItemList
        selectedRole={role}
        selectedPeerId={peerId}
        onSelect={onSelect}
        peers={peers}
        searchValue={search}
      />
    </Fragment>
  );
};
