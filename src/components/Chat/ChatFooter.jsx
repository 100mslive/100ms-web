import React, { useCallback, useEffect, useRef, useState } from "react";
import data from "@emoji-mart/data";
import { Picker } from "emoji-mart";
import { Box, Popover, Flex, IconButton, styled } from "@100mslive/react-ui";
import { useHMSActions } from "@100mslive/react-sdk";
import { ToastManager } from "../Toast/ToastManager";
import { EmojiIcon, SendIcon } from "@100mslive/react-icons";
import { useChatDraftMessage } from "../AppData/useChatState";

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
  const ref = useRef();
  const pickerRef = useRef(null);

  useEffect(() => {
    if (!pickerRef.current) {
      pickerRef.current = new Picker({
        data,
        ref,
        onEmojiSelect: onSelect,
        style: { width: "90% !important" },
        previewPosition: "none",
        skinPosition: "search",
      });
    }
  }, []); //eslint-disable-line

  return <Box ref={ref} />;
}

export const ChatFooter = ({ role, peerId, onSend, children }) => {
  const hmsActions = useHMSActions();
  const inputRef = useRef(null);
  const [draftMessage, setDraftMessage] = useChatDraftMessage();
  const [showEmoji, setShowEmoji] = useState(false);

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
      />
      <Popover.Root open={showEmoji} onOpenChange={setShowEmoji}>
        <Popover.Trigger asChild css={{ appearance: "none" }}>
          <IconButton as="div">
            <EmojiIcon />
          </IconButton>
        </Popover.Trigger>
        <Popover.Content
          alignOffset={-40}
          sideOffset={16}
          css={{
            p: 0,
            "em-emoji-picker": {
              width: "100%",
              "--rgb-background": "transparent",
            },
          }}
        >
          <EmojiPicker
            onSelect={emoji => {
              inputRef.current.value += ` ${emoji.native} `;
            }}
          />
        </Popover.Content>
      </Popover.Root>
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
