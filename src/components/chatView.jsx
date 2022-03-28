import React from "react";
import { Chat } from "./Chat/Chat";

export const ChatView = ({ toggleChat }) => {
  return <Chat onClose={toggleChat} />;
};
