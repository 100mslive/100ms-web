import React from "react";
import { Flex, IconButton, Text } from "@100mslive/react-ui";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CrossIcon,
  PeopleIcon,
} from "@100mslive/react-icons";

export const ChatHeader = React.memo(
  ({ selection, open, onToggle, onClose }) => {
    return (
      <Flex
        onClick={onToggle}
        align="center"
        css={{
          bg: "$menuBg",
          color: "$textPrimary",
          h: "$16",
          borderTopLeftRadius: "$2",
          borderTopRightRadius: "$2",
          pl: "$8",
          pr: "$4",
        }}
      >
        <Flex align="center" css={{ cursor: "pointer" }}>
          <PeopleIcon />
          <Text css={{ mx: "$2" }}>{selection}</Text>
          {open ? (
            <ChevronUpIcon width={18} height={18} />
          ) : (
            <ChevronDownIcon width={18} height={18} />
          )}
        </Flex>
        <IconButton
          css={{ ml: "auto" }}
          onClick={e => {
            e.stopPropagation();
            open ? onToggle() : onClose();
          }}
        >
          <CrossIcon />
        </IconButton>
      </Flex>
    );
  }
);
