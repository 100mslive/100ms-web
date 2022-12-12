import React, { useCallback, useRef, useState } from "react";
import {
  selectHMSMessagesCount,
  selectPeerNameByID,
  selectPermissions,
  selectSessionMetadata,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { ChevronDownIcon, CrossIcon, PinIcon } from "@100mslive/react-icons";
import { Box, Button, Flex, IconButton, Text } from "@100mslive/react-ui";
import { AnnotisedMessage, ChatBody } from "./ChatBody";
import { ChatFooter } from "./ChatFooter";
import { ChatHeader } from "./ChatHeader";
import { useSetUiSettings } from "../AppData/useUISettings";
import { useSetPinnedMessage } from "../hooks/useSetPinnedMessage";
import { useUnreadCount } from "./useUnreadCount";
import { APP_DATA } from "../../common/constants";

const PinnedMessage = ({ clearPinnedMessage }) => {
  const permissions = useHMSStore(selectPermissions);
  const pinnedMessage = useHMSStore(selectSessionMetadata);

  return pinnedMessage ? (
    <Flex
      css={{ p: "$8", color: "$textMedEmp", bg: "$surfaceLight", r: "$1" }}
      align="center"
      justify="between"
    >
      <Box>
        <PinIcon />
      </Box>
      <Box
        css={{
          ml: "$8",
          color: "$textMedEmp",
          w: "100%",
          maxHeight: "$18",
          overflowY: "auto",
        }}
      >
        <Text variant="sm">
          <AnnotisedMessage message={pinnedMessage} />
        </Text>
      </Box>
      {permissions.removeOthers && (
        <IconButton onClick={() => clearPinnedMessage()}>
          <CrossIcon />
        </IconButton>
      )}
    </Flex>
  ) : null;
};

export const Chat = () => {
  const [storedSelector, setStoredSelector] = useSetUiSettings(
    APP_DATA.chatSelector
  );
  const peerName = useHMSStore(selectPeerNameByID(storedSelector));
  const [chatOptions, setChatOptions] = useState({
    role: storedSelector || "",
    peerId: storedSelector || "",
    selection: storedSelector ? peerName || storedSelector : "Everyone",
  });
  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const listRef = useRef(null);
  const hmsActions = useHMSActions();
  const { setPinnedMessage } = useSetPinnedMessage();

  const storeMessageSelector = selectHMSMessagesCount;

  const messagesCount = useHMSStore(storeMessageSelector) || 0;
  const scrollToBottom = useCallback(
    (unreadCount = 0) => {
      if (listRef.current && listRef.current.scrollToItem && unreadCount > 0) {
        listRef.current?.scrollToItem(messagesCount, "end");
        requestAnimationFrame(() => {
          listRef.current?.scrollToItem(messagesCount, "end");
        });
        hmsActions.setMessageRead(true);
      }
    },
    [hmsActions, messagesCount]
  );

  return (
    <Flex direction="column" css={{ size: "100%" }}>
      <ChatHeader
        selectorOpen={isSelectorOpen}
        selection={chatOptions.selection}
        onSelect={({ role, peerId, selection }) => {
          setChatOptions({
            role,
            peerId,
            selection,
          });
          setStoredSelector(peerId || role);
        }}
        role={chatOptions.role}
        peerId={chatOptions.peerId}
        onToggle={() => {
          setSelectorOpen(value => !value);
        }}
      />
      <PinnedMessage clearPinnedMessage={setPinnedMessage} />

      <ChatBody
        role={chatOptions.role}
        peerId={chatOptions.peerId}
        setPinnedMessage={setPinnedMessage}
        ref={listRef}
      />
      <ChatFooter
        role={chatOptions.role}
        peerId={chatOptions.peerId}
        onSend={() => scrollToBottom(1)}
      >
        {!isSelectorOpen && (
          <NewMessageIndicator
            role={chatOptions.role}
            peerId={chatOptions.peerId}
            scrollToBottom={scrollToBottom}
          />
        )}
      </ChatFooter>
    </Flex>
  );
};

const NewMessageIndicator = ({ role, peerId, scrollToBottom }) => {
  const unreadCount = useUnreadCount({ role, peerId });
  if (!unreadCount) {
    return null;
  }
  return (
    <Flex
      justify="center"
      css={{
        width: "100%",
        left: 0,
        bottom: "100%",
        position: "absolute",
      }}
    >
      <Button
        onClick={() => {
          scrollToBottom(unreadCount);
        }}
        css={{ p: "$2 $4", "& > svg": { ml: "$4" } }}
      >
        New Messages
        <ChevronDownIcon width={16} height={16} />
      </Button>
    </Flex>
  );
};
