import React from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CrossIcon,
  PeopleIcon,
} from "@100mslive/react-icons";
import { Flex, IconButton, Text } from "@100mslive/react-ui";
import { useSidepaneToggle } from "../AppData/useSidepane";
import { SIDE_PANE_OPTIONS } from "../../common/constants";

export const ChatHeader = React.memo(
  ({ selection, selectorOpen, onToggle }) => {
    const toggleChat = useSidepaneToggle(SIDE_PANE_OPTIONS.CHAT);
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
          data-testid="close_chat"
        >
          <CrossIcon />
        </IconButton>
      </Flex>
    );
  }
);
