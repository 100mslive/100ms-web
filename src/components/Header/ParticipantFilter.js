import { useCallback, useState } from "react";
import { Box, Dropdown, Flex, Text, textEllipsis } from "@100mslive/react-ui";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HandRaiseIcon,
  PeopleIcon,
} from "@100mslive/react-icons";

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
      <Dropdown.TriggerItem
        asChild
        data-testid="participant_list_filter"
        css={{
          w: "auto",
          p: "$2 $4",
          border: "1px solid $textDisabled",
          borderRadius: "$1",
          h: "auto",
          cursor: "pointer",
        }}
      >
        <Flex align="center">
          <Text variant="sm" css={{ ...textEllipsis(80) }}>
            {selectionValue || "Everyone"}
          </Text>
          <Box css={{ ml: "$2", color: "$textDisabled" }}>
            {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Box>
        </Flex>
      </Dropdown.TriggerItem>
      <Dropdown.Content
        css={{ height: "auto", maxHeight: "$96", boxShadow: "$md" }}
      >
        <Item
          selected={!selection}
          title="Everyone"
          onSelection={onItemClick}
          icon={<PeopleIcon />}
        />
        <Item
          selected={selection === "isHandRaise"}
          title="Raised Hand"
          onSelection={onItemClick}
          icon={<HandRaiseIcon />}
          value={{ metadata: { isHandRaised: true }, role: "" }}
        />
        <Dropdown.ItemSeparator />
        {roles.map(role => (
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
    <Flex
      align="center"
      css={{ w: "100%", p: "$4 $8", cursor: "pointer" }}
      onClick={() => onSelection(value)}
    >
      {icon && <Text css={{ mr: "$2" }}>{icon}</Text>}
      <Text css={{ flex: "1 1 0" }}>{title}</Text>
      {selected && (
        <Text>
          <CheckIcon widht={16} height={16} />
        </Text>
      )}
    </Flex>
  );
};
