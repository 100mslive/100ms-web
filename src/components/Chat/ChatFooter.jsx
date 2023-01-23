import React, { useCallback, useEffect, useRef, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useHMSActions } from "@100mslive/react-sdk";
import { EmojiIcon, SendIcon } from "@100mslive/react-icons";
import { Box, Flex, IconButton, Popover, styled } from "@100mslive/react-ui";
import { ToastManager } from "../Toast/ToastManager";
import { useChatDraftMessage } from "../AppData/useChatState";
import { useEmojiPickerStyles } from "./useEmojiPickerStyles";

const TextArea = styled("textarea", {
  width: "100%",
  bg: "transparent",
  color: "$textPrimary",
  resize: "none",
  lineHeight: "1rem",
  "&:focus": {
    boxShadow: "none",
    outline: "none",
  },
});

function EmojiPicker({ onSelect }) {
  const [showEmoji, setShowEmoji] = useState(false);
  const ref = useEmojiPickerStyles(showEmoji);
  return (
    <Popover.Root open={showEmoji} onOpenChange={setShowEmoji}>
      <Popover.Trigger asChild css={{ appearance: "none" }}>
        <IconButton as="div">
          <EmojiIcon />
        </IconButton>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          alignOffset={-40}
          sideOffset={16}
          align="end"
          css={{
            p: 0,
          }}
        >
          <Box
            css={{
              minWidth: 352,
              minHeight: 435,
            }}
            ref={ref}
          >
            <Picker
              onEmojiSelect={onSelect}
              data={data}
              previewPosition="none"
              skinPosition="search"
            />
          </Box>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export const ChatFooter = ({ role, peerId, onSend, children }) => {
  const hmsActions = useHMSActions();
  const inputRef = useRef(null);
  const [draftMessage, setDraftMessage] = useChatDraftMessage();

  const sendMessage = useCallback(async () => {
    const message = inputRef.current.value;
    if (!message || !message.trim().length) {
      return;
    }
    try {
      if (role) {
        await hmsActions.sendGroupMessage(message, [role]);
      } else if (peerId) {
        await hmsActions.sendDirectMessage(message, peerId);
      } else {
        await hmsActions.sendBroadcastMessage(message);
      }
      inputRef.current.value = "";
      setTimeout(() => {
        onSend();
      }, 0);
    } catch (error) {
      ToastManager.addToast({ title: error.message });
    }
  }, [role, peerId, hmsActions, onSend]);

  useEffect(() => {
    const messageElement = inputRef.current;
    if (messageElement) {
      messageElement.value = draftMessage;
    }
  }, [draftMessage]);

  useEffect(() => {
    const messageElement = inputRef.current;
    return () => {
      setDraftMessage(messageElement?.value || "");
    };
  }, [setDraftMessage]);

  return (
    <Flex
      align="center"
      css={{
        bg: "$surfaceLight",
        minHeight: "$16",
        maxHeight: "$24",
        position: "relative",
        py: "$6",
        pl: "$8",
        r: "$1",
      }}
    >
      {children}
      <TextArea
        placeholder="Write something here"
        ref={inputRef}
        autoFocus
        onKeyPress={async event => {
          if (event.key === "Enter") {
            if (!event.shiftKey) {
              event.preventDefault();
              await sendMessage();
            }
          }
        }}
        autoComplete="off"
        aria-autocomplete="none"
        onPaste={e => e.stopPropagation()}
        onCut={e => e.stopPropagation()}
        onCopy={e => e.stopPropagation()}
      />
      <EmojiPicker
        onSelect={emoji => {
          inputRef.current.value += ` ${emoji.native} `;
        }}
      />
      <IconButton
        onClick={sendMessage}
        css={{ ml: "auto", height: "max-content", mr: "$4" }}
        data-testid="send_msg_btn"
      >
        <SendIcon />
      </IconButton>
    </Flex>
  );
};
