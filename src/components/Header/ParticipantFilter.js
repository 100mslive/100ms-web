import { useCallback, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HandRaiseIcon,
  PeopleIcon,
} from "@100mslive/react-icons";
import { Box, Dropdown, Flex, Text, textEllipsis } from "@100mslive/react-ui";
import { isInternalRole } from "../../common/utils";

export const ParticipantFilter = ({
  selection,
  onSelection,
  isConnected,
  roles,
}) => {
  const [open, setOpen] = useState(false);
  const selectionValue =
    selection?.role || (selection?.metadata?.isHandRaised ? "Raised Hand" : "");
  const onItemClick = useCallback(value => {
    onSelection(value);
    setOpen(false);
  }, []); //eslint-disable-line
  if (!isConnected) {
    return null;
  }
  return (
    <Dropdown.Root open={open} onOpenChange={value => setOpen(value)}>
      <Dropdown.Trigger
        asChild
        data-testid="participant_list_filter"
        css={{
          border: "1px solid $textDisabled",
          r: "$0",
          p: "$2 $4",
        }}
        tabIndex={0}
      >
        <Flex align="center">
          <Text variant="sm" css={{ ...textEllipsis(80) }}>
            {selectionValue || "Everyone"}
          </Text>
          <Box css={{ ml: "$2", color: "$textDisabled" }}>
            {open ? (
              <ChevronUpIcon width={14} height={14} />
            ) : (
              <ChevronDownIcon width={14} height={14} />
            )}
          </Box>
        </Flex>
      </Dropdown.Trigger>
      <Dropdown.Content
        align="start"
        sideOffset={8}
        css={{
          height: "auto",
          maxHeight: "$96",
          boxShadow: "$md",
          w: "$48",
        }}
      >
        <Item
          selected={!selection}
          title="Everyone"
          onSelection={onItemClick}
          icon={<PeopleIcon />}
        />
        <Item
          selected={selection?.metadata?.isHandRaised}
          title="Raised Hand"
          onSelection={onItemClick}
          icon={<HandRaiseIcon />}
          value={{ metadata: { isHandRaised: true }, role: "" }}
        />
        <Dropdown.ItemSeparator />
        {roles
          .filter(role => !isInternalRole(role))
          .map(role => (
            <Item
              key={role}
              selected={selectionValue === role}
              title={role}
              value={{ metadata: { isHandRaised: false }, role }}
              onSelection={onItemClick}
            />
          ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
};

const Item = ({ selected, title, onSelection, value, icon }) => {
  return (
    <Dropdown.Item
      onClick={e => {
        e.preventDefault();
        onSelection(value);
      }}
    >
      <Flex align="center" css={{ flex: "1 1 0" }}>
        {icon && <Text>{icon}</Text>}
        <Text css={{ ml: "$4" }}>{title}</Text>
      </Flex>
      {selected && (
        <Text>
          <CheckIcon widht={16} height={16} />
        </Text>
      )}
    </Dropdown.Item>
  );
};
