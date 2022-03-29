import React, { useCallback, useRef, useState } from "react";
import { Box, Button, Flex } from "@100mslive/react-ui";
import { ChatFooter } from "./ChatFooter";
import { ChatHeader } from "./ChatHeader";
import { ChatBody } from "./ChatBody";
import { ChatSelector } from "./ChatSelector";
import {
  selectMessagesUnreadCountByPeerID,
  selectMessagesUnreadCountByRole,
  selectUnreadHMSMessagesCount,
  useHMSStore,
} from "@100mslive/react-sdk";
import { ChevronDownIcon } from "@100mslive/react-icons";

export const Chat = ({ onClose }) => {
  const [chatOptions, setChatOptions] = useState({
    role: "",
    peerId: "",
    selection: "Everyone",
  });
  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const bodyRef = useRef(null);
  const scrollToBottom = useCallback(() => {
    if (!bodyRef.current) {
      return;
    }
    bodyRef.current.scrollTo({
      top: bodyRef.current.scrollHeight,
    });
  }, []);
  return (
    <Flex direction="column" css={{ size: "100%" }}>
      <ChatHeader
        open={isSelectorOpen}
        selection={chatOptions.selection}
        onToggle={() => {
          setSelectorOpen(value => !value);
        }}
        onClose={onClose}
      />
      <Box
        css={{
          flex: "1 1 0",
          overflowY: isSelectorOpen ? "hidden" : "auto",
          bg: "$bgSecondary",
          pt: "$4",
          position: "relative",
        }}
        ref={bodyRef}
      >
        <ChatBody role={chatOptions.role} peerId={chatOptions.peerId} />
        {isSelectorOpen && (
          <ChatSelector
            role={chatOptions.role}
            peerId={chatOptions.peerId}
            onSelect={data => {
              setChatOptions(state => ({
                ...state,
                ...data,
              }));
              setSelectorOpen(false);
            }}
          />
        )}
      </Box>

      <ChatFooter
        role={chatOptions.role}
        peerId={chatOptions.peerId}
        onSend={scrollToBottom}
      >
        <NewMessageIndicator
          role={chatOptions.role}
          peerId={chatOptions.peerId}
          onClick={scrollToBottom}
        />
      </ChatFooter>
    </Flex>
  );
};

const NewMessageIndicator = ({ role, peerId, onClick }) => {
  const unreadCountSelector = role
    ? selectMessagesUnreadCountByRole(role)
    : peerId
    ? selectMessagesUnreadCountByPeerID(peerId)
    : selectUnreadHMSMessagesCount;

  const unreadCount = useHMSStore(unreadCountSelector);
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
      <Button onClick={onClick} css={{ p: "$2 $4", "& > svg": { ml: "$4" } }}>
        New Messages
        <ChevronDownIcon width={16} height={16} />
      </Button>
    </Flex>
  );
};
