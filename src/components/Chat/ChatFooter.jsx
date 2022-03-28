import React, { useCallback, useRef } from "react";
import { Flex, IconButton, styled } from "@100mslive/react-ui";
import { useHMSActions } from "@100mslive/react-sdk";
import { ToastManager } from "../Toast/ToastManager";
import { SendIcon } from "@100mslive/react-icons";

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

export const ChatFooter = ({ role, peerId, onSend, children }) => {
  const hmsActions = useHMSActions();
  const inputRef = useRef(null);
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
      onSend();
    } catch (error) {
      ToastManager.addToast({ title: error.message });
    }
  }, [role, peerId, hmsActions, onSend]);
  return (
    <Flex
      align="center"
      css={{
        borderTop: "1px solid $borderDefault",
        bg: "$menuBg",
        minHeight: "$16",
        maxHeight: "$24",
        position: "relative",
        py: "$4",
        pl: "$8",
      }}
    >
      {children}
      <TextArea
        placeholder="Write something here"
        ref={inputRef}
        onKeyPress={async event => {
          if (event.key === "Enter") {
            if (!event.shiftKey) {
              event.preventDefault();
              await sendMessage();
            }
          }
        }}
      />
      <IconButton
        onClick={sendMessage}
        css={{ ml: "auto", height: "max-content", mr: "$4" }}
      >
        <SendIcon />
      </IconButton>
    </Flex>
  );
};
