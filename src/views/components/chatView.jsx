import { ChatBox } from "@100mslive/sdk-components";
import React from "react";

export const ChatView = ({ toggleChat }) => {
  return (
    <ChatBox onClose={toggleChat} />
  );
};
