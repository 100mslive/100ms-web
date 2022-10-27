import React, { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
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
import { useSetPinnedMessage } from "../hooks/useSetPinnedMessage";
import { useUnreadCount } from "./useUnreadCount";

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
  const [chatOptions, setChatOptions] = useState({
    role: "",
    peerId: "",
    selection: "Everyone",
  });
  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const bodyRef = useRef(null);
  const hmsActions = useHMSActions();
  const { setPinnedMessage } = useSetPinnedMessage();

  const scrollToBottom = useCallback(
    (instant = false) => {
      if (!bodyRef.current) {
        return;
      }
      bodyRef.current.scrollTo({
        top: bodyRef.current.scrollHeight,
        behavior: instant ? "instant" : "smooth",
      });
      hmsActions.setMessageRead(true);
    },
    [hmsActions]
  );

  useEffect(() => {
    scrollToBottom(true);
  }, [scrollToBottom]);

  return (
    <Flex direction="column" css={{ size: "100%" }}>
      <ChatHeader
        selectorOpen={isSelectorOpen}
        selection={chatOptions.selection}
        onSelect={setChatOptions}
        role={chatOptions.role}
        peerId={chatOptions.peerId}
        onToggle={() => {
          setSelectorOpen(value => !value);
        }}
      />
      <PinnedMessage clearPinnedMessage={setPinnedMessage} />
      <Flex
        direction="column"
        css={{
          flex: "1 1 0",
          overflowY: "auto",
          pt: "$4",
          position: "relative",
          // Below two are for pushing scroll to the edge of the box
          mr: "-$10",
          pr: "$10",
        }}
        ref={bodyRef}
      >
        <ChatBody
          role={chatOptions.role}
          peerId={chatOptions.peerId}
          setPinnedMessage={setPinnedMessage}
        />
        <ScrollHandler
          scrollToBottom={scrollToBottom}
          role={chatOptions.role}
          peerId={chatOptions.peerId}
        />
      </Flex>
      <ChatFooter
        role={chatOptions.role}
        peerId={chatOptions.peerId}
        onSend={scrollToBottom}
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
          scrollToBottom();
        }}
        css={{ p: "$2 $4", "& > svg": { ml: "$4" } }}
      >
        New Messages
        <ChevronDownIcon width={16} height={16} />
      </Button>
    </Flex>
  );
};

const ScrollHandler = ({ scrollToBottom, role, peerId }) => {
  const { ref, inView } = useInView({ threshold: 0.5 });
  const unreadCount = useUnreadCount({ role, peerId });
  useEffect(() => {
    if (inView && unreadCount) {
      scrollToBottom();
    }
  }, [inView, unreadCount, scrollToBottom]);
  return <div ref={ref} style={{ height: 1 }}></div>;
};
