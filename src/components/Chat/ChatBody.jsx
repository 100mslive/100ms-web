import React, { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import {
  selectHMSMessages,
  selectLocalPeerID,
  selectMessagesByPeerID,
  selectMessagesByRole,
  selectPeerNameByID,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Flex, styled, Text } from "@100mslive/react-ui";

const formatTime = date => {
  if (!(date instanceof Date)) {
    return "";
  }
  let hours = date.getHours();
  let mins = date.getMinutes();
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (mins < 10) {
    mins = "0" + mins;
  }
  return `${hours}:${mins}`;
};

const MessageType = ({ roles, hasCurrentUserSent, receiver }) => {
  const peerName = useHMSStore(selectPeerNameByID(receiver));
  if (receiver) {
    return (
      <Text variant="sm" css={{ mx: "$4" }}>
        {hasCurrentUserSent ? `to ${peerName}` : "to me"}
        <Text as="span" variant="sm" css={{ color: "$error", mx: "$4" }}>
          (Privately)
        </Text>
      </Text>
    );
  }

  if (roles && roles.length) {
    return (
      <Text variant="sm" css={{ mx: "$4" }}>
        to
        <Text as="span" variant="sm" css={{ color: "$error", mx: "$4" }}>
          ({roles.join(",")})
        </Text>
      </Text>
    );
  }
  return (
    <Text variant="sm" css={{ mx: "$4" }}>
      to
      <Text as="span" variant="sm" css={{ color: "$brandDefault", mx: "$4" }}>
        Everyone
      </Text>
    </Text>
  );
};

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const Link = styled("a", {
  color: "$brandDefault",
  wordBreak: "break-all",
  "&:hover": {
    textDecoration: "underline",
  },
});

const AnnotisedChat = ({ message }) => {
  return (
    <Fragment>
      {message
        .trim()
        .split(" ")
        .map(part =>
          URL_REGEX.test(part) ? (
            <Link
              href={part}
              key={part}
              target="_blank"
              rel="noopener noreferrer"
            >
              {part}{" "}
            </Link>
          ) : (
            `${part} `
          )
        )}
    </Fragment>
  );
};

const ChatMessage = React.memo(({ message }) => {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });
  const hmsActions = useHMSActions();
  const localPeerId = useHMSStore(selectLocalPeerID);

  useEffect(() => {
    if (message.id && !message.read && inView) {
      hmsActions.setMessageRead(true, message.id);
    }
  }, [message.read, hmsActions, inView, message.id]);

  return (
    <Flex ref={ref} css={{ flexWrap: "wrap", p: "$4 $8" }} key={message.time}>
      <Text variant="sm" css={{ color: "$textSecondary" }}>
        {message.senderName}
      </Text>
      <MessageType
        hasCurrentUserSent={message.sender === localPeerId}
        receiver={message.recipientPeer}
        roles={message.recipientRoles}
      />
      <Text variant="sm" css={{ ml: "auto", color: "$textSecondary" }}>
        {formatTime(message.time)}
      </Text>
      <Text css={{ w: "100%", my: "$2", wordBreak: "break-word" }}>
        <AnnotisedChat message={message.message} />
      </Text>
    </Flex>
  );
});

export const ChatBody = ({ role, peerId }) => {
  const storeMessageSelector = role
    ? selectMessagesByRole(role)
    : peerId
    ? selectMessagesByPeerID(peerId)
    : selectHMSMessages;
  const messages = useHMSStore(storeMessageSelector) || [];

  if (messages.length === 0) {
    return (
      <Flex css={{ size: "100%" }} align="center" justify="center">
        <Text>There are no messages here</Text>
      </Flex>
    );
  }

  return (
    <Fragment>
      {messages.map(message => {
        return <ChatMessage key={message.id} message={message} />;
      })}
    </Fragment>
  );
};
