import React from "react";
import { Flex, IconButton, Text } from "@100mslive/react-ui";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CrossIcon,
  PeopleIcon,
} from "@100mslive/react-icons";
import { useToggleChat } from "../AppData/useChatState";

export const ChatHeader = React.memo(
  ({ selection, selectorOpen, onToggle }) => {
    const toggleChat = useToggleChat();
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
          {selectorOpen ? (
            <ChevronUpIcon width={18} height={18} />
          ) : (
            <ChevronDownIcon width={18} height={18} />
          )}
        </Flex>
        <IconButton
          css={{ ml: "auto" }}
          onClick={e => {
            e.stopPropagation();
            selectorOpen ? onToggle() : toggleChat();
          }}
        >
          <CrossIcon />
        </IconButton>
      </Flex>
    );
  }
);
