import React, { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import {
  selectHMSMessages,
  selectLocalPeerID,
  selectLocalPeerRoleName,
  selectMessagesByPeerID,
  selectMessagesByRole,
  selectPeerNameByID,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Box, Flex, styled, Text } from "@100mslive/react-ui";

const formatTime = date => {
  if (!(date instanceof Date)) {
    return "";
  }
  let hours = date.getHours();
  let mins = date.getMinutes();
  const suffix = hours > 11 ? "PM" : "AM";
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (mins < 10) {
    mins = "0" + mins;
  }
  return `${hours}:${mins} ${suffix}`;
};

const MessageTypeContainer = ({ left, right }) => {
  return (
    <Flex
      align="center"
      css={{
        ml: "auto",
        mr: "$4",
        p: "$2 $4",
        border: "1px solid $textDisabled",
        r: "$0",
      }}
    >
      {left && (
        <Text variant="tiny" as="span" css={{ color: "$textMedEmp" }}>
          {left}
        </Text>
      )}
      {left && right && (
        <Box
          css={{ borderLeft: "1px solid $textDisabled", mx: "$4", h: "$8" }}
        />
      )}
      {right && (
        <Text as="span" variant="tiny">
          {right}
        </Text>
      )}
    </Flex>
  );
};

const MessageType = ({ roles, hasCurrentUserSent, receiver }) => {
  const peerName = useHMSStore(selectPeerNameByID(receiver));
  const localPeerRoleName = useHMSStore(selectLocalPeerRoleName);
  if (receiver) {
    return (
      <MessageTypeContainer
        left={
          hasCurrentUserSent ? `${peerName ? `TO ${peerName}` : ""}` : "TO YOU"
        }
        right="PRIVATE"
      />
    );
  }

  if (roles && roles.length) {
    return (
      <MessageTypeContainer
        left="TO"
        right={hasCurrentUserSent ? roles.join(",") : localPeerRoleName}
      />
    );
  }
  return null;
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
  if (!message) {
    return <Fragment />;
  }

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

const getMessageType = ({ roles, receiver }) => {
  if (roles && roles.length > 0) {
    return "role";
  }
  return receiver ? "private" : "";
};

const ChatMessage = React.memo(({ message, autoMarginTop = false }) => {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });
  const hmsActions = useHMSActions();
  const localPeerId = useHMSStore(selectLocalPeerID);
  const messageType = getMessageType({
    roles: message.recipientRoles,
    receiver: message.recipientPeer,
  });

  useEffect(() => {
    if (message.id && !message.read && inView) {
      hmsActions.setMessageRead(true, message.id);
    }
  }, [message.read, hmsActions, inView, message.id]);

  return (
    <Flex
      ref={ref}
      align="center"
      css={{
        flexWrap: "wrap",
        bg: messageType ? "$surfaceLight" : undefined,
        px: messageType ? "$4" : "$2",
        py: messageType ? "$4" : 0,
        r: "$1",
        mb: "$10",
        mt: autoMarginTop ? "auto" : undefined,
      }}
      key={message.time}
      data-testid="chat_msg"
    >
      <Text css={{ color: "$textHighEmp", fontWeight: "$semiBold" }}>
        {message.senderName || "Anonymous"}
      </Text>
      <Text variant="sm" css={{ ml: "$4", color: "$textSecondary" }}>
        {formatTime(message.time)}
      </Text>
      <MessageType
        hasCurrentUserSent={message.sender === localPeerId}
        receiver={message.recipientPeer}
        roles={message.recipientRoles}
      />
      <Text
        variant="body2"
        css={{
          w: "100%",
          mt: "$2",
          wordBreak: "break-word",
        }}
      >
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
      <Flex
        css={{
          width: "100%",
          height: "calc(100% - 1px)",
          textAlign: "center",
          px: "$4",
        }}
        align="center"
        justify="center"
      >
        <Text>There are no messages here</Text>
      </Flex>
    );
  }

  return (
    <Fragment>
      {messages.map((message, index) => {
        return (
          <ChatMessage
            key={message.id}
            message={message}
            autoMarginTop={index === 0}
          />
        );
      })}
    </Fragment>
  );
};
