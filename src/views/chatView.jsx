import { ChatBox, useHMSMessage } from "@100mslive/sdk-components";
import React from "react";

export const ChatView = ({ toggleChat }) => {
  const { messages, sendMessage } = useHMSMessage();
  return (
    <ChatBox messages={messages} onSend={sendMessage} onClose={toggleChat} />
  );
};
