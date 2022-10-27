import React, { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CrossIcon,
} from "@100mslive/react-icons";
import {
  Box,
  Dropdown,
  Flex,
  IconButton,
  Text,
  textEllipsis,
} from "@100mslive/react-ui";
import { ChatSelector } from "./ChatSelector";
import { useSidepaneToggle } from "../AppData/useSidepane";
import { SIDE_PANE_OPTIONS } from "../../common/constants";

export const ChatHeader = React.memo(
  ({ selection, selectorOpen, onToggle, onSelect, role, peerId }) => {
    const [open, setOpen] = useState(false);
    const toggleChat = useSidepaneToggle(SIDE_PANE_OPTIONS.CHAT);
    return (
      <Flex
        onClick={onToggle}
        align="center"
        css={{
          color: "$textPrimary",
          h: "$16",
          mb: "$2",
        }}
      >
        <Text variant="h6">Chat </Text>
        <Dropdown.Root open={open} onOpenChange={value => setOpen(value)}>
          <Dropdown.Trigger
            asChild
            data-testid="participant_list_filter"
            css={{
              border: "1px solid $textDisabled",
              r: "$0",
              p: "$2 $4",
              ml: "$8",
            }}
            tabIndex={0}
          >
            <Flex align="center">
              <Text variant="sm" css={{ ...textEllipsis(80) }}>
                {selection}
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
            css={{
              w: "$64",
              overflow: "hidden",
              maxHeight: "unset",
            }}
            align="start"
            sideOffset={8}
          >
            <ChatSelector onSelect={onSelect} role={role} peerId={peerId} />
          </Dropdown.Content>
        </Dropdown.Root>
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
