import { ChatBox } from "@100mslive/hms-video-react";
import React from "react";

export const ChatView = ({ toggleChat }) => {
  return <ChatBox onClose={toggleChat} />;
};
