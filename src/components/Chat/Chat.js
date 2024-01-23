import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  HMSNotificationTypes,
  selectHMSMessagesCount,
  selectPeerNameByID,
  selectPermissions,
  selectSessionStore,
  useHMSActions,
  useHMSNotifications,
  useHMSStore,
} from "@100mslive/react-sdk";
import { ChevronDownIcon, CrossIcon, PinIcon } from "@100mslive/react-icons";
import { Box, Button, Flex, IconButton, Text } from "@100mslive/roomkit-react";
import { AnnotisedMessage, ChatBody } from "./ChatBody";
import { ChatFooter } from "./ChatFooter";
import { ChatHeader } from "./ChatHeader";
import { useSetSubscribedChatSelector } from "../AppData/useUISettings";
import { useSetPinnedMessage } from "../hooks/useSetPinnedMessage";
import { useUnreadCount } from "./useUnreadCount";
import { CHAT_SELECTOR, SESSION_STORE_KEY } from "../../common/constants";

const PinnedMessage = ({ clearPinnedMessage }) => {
  const permissions = useHMSStore(selectPermissions);
  const pinnedMessage = useHMSStore(
    selectSessionStore(SESSION_STORE_KEY.PINNED_MESSAGE)
  );

  return pinnedMessage ? (
    <Flex
      css={{
        p: "$8",
        color: "$on_surface_medium",
        bg: "$surface_bright",
        r: "$1",
      }}
      align="center"
      justify="between"
    >
      <Box>
        <PinIcon />
      </Box>
      <Box
        css={{
          ml: "$8",
          color: "$on_surface_medium",
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
  const notification = useHMSNotifications(HMSNotificationTypes.PEER_LEFT);
  const [peerSelector, setPeerSelector] = useSetSubscribedChatSelector(
    CHAT_SELECTOR.PEER_ID
  );
  const [roleSelector, setRoleSelector] = useSetSubscribedChatSelector(
    CHAT_SELECTOR.ROLE
  );
  const peerName = useHMSStore(selectPeerNameByID(peerSelector));
  const [chatOptions, setChatOptions] = useState(() => {
    const roleValue = roleSelector || "";
    const peerIdValue = peerSelector && peerName ? peerSelector : "";
    const selectionValue =
      roleSelector || (peerSelector && peerName)
        ? roleSelector || peerName
        : "Everyone";

    return {
      role: roleValue,
      peerId: peerIdValue,
      selection: selectionValue,
    };
  });
  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const listRef = useRef(null);
  const hmsActions = useHMSActions();
  const { setPinnedMessage } = useSetPinnedMessage();
  useEffect(() => {
    if (
      notification &&
      notification.data &&
      peerSelector === notification.data.id
    ) {
      setPeerSelector("");
      setChatOptions({
        role: "",
        peerId: "",
        selection: "Everyone",
      });
    }
  }, [notification, peerSelector, setPeerSelector]);

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
          setPeerSelector(peerId);
          setRoleSelector(role);
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
        ref={listRef}
        scrollToBottom={scrollToBottom}
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
