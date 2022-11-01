import React, { Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  selectHMSMessages,
  selectLocalPeerID,
  selectLocalPeerRoleName,
  selectMessagesByPeerID,
  selectMessagesByRole,
  selectPeerNameByID,
  selectPermissions,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { HorizontalMenuIcon, PinIcon } from "@100mslive/react-icons";
import {
  Box,
  Dropdown,
  Flex,
  IconButton,
  styled,
  Text,
  Tooltip,
} from "@100mslive/react-ui";

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
        <SenderName variant="tiny" as="span" css={{ color: "$textMedEmp" }}>
          {left}
        </SenderName>
      )}
      {left && right && (
        <Box
          css={{ borderLeft: "1px solid $textDisabled", mx: "$4", h: "$8" }}
        />
      )}
      {right && (
        <SenderName as="span" variant="tiny">
          {right}
        </SenderName>
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
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const Link = styled("a", {
  color: "$brandDefault",
  wordBreak: "break-word",
  "&:hover": {
    textDecoration: "underline",
  },
});

export const AnnotisedMessage = ({ message }) => {
  if (!message) {
    return <Fragment />;
  }

  return (
    <Fragment>
      {message
        .trim()
        .split(/(\s)/)
        .map(part =>
          URL_REGEX.test(part) ? (
            <Link
              href={part}
              key={part}
              target="_blank"
              rel="noopener noreferrer"
            >
              {part}
            </Link>
          ) : (
            part
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

const ChatActions = ({ onPin }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown.Root open={open} onOpenChange={setOpen}>
      <Dropdown.Trigger asChild>
        <IconButton>
          <Tooltip title="More options">
            <Box>
              <HorizontalMenuIcon />
            </Box>
          </Tooltip>
        </IconButton>
      </Dropdown.Trigger>

      <Dropdown.Content sideOffset={5} align="center" css={{ width: "$48" }}>
        <Dropdown.Item data-testid="pin_message_btn" onClick={onPin}>
          <PinIcon />
          <Text variant="sm" css={{ ml: "$4" }}>
            Pin Message
          </Text>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
};

const SenderName = styled(Text, {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "24ch",
  minWidth: 0,
});

const ChatMessage = React.memo(({ message, autoMarginTop = false, onPin }) => {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });
  const hmsActions = useHMSActions();
  const localPeerId = useHMSStore(selectLocalPeerID);
  const permissions = useHMSStore(selectPermissions);
  const messageType = getMessageType({
    roles: message.recipientRoles,
    receiver: message.recipientPeer,
  });
  // show pin action only if peer has remove others permission and the message is of broadcast type
  const showPinAction = permissions.removeOthers && !messageType;

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
      <Text
        css={{
          color: "$textHighEmp",
          fontWeight: "$semiBold",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
        as="div"
      >
        <Flex align="center">
          {message.senderName === "You" || !message.senderName ? (
            <SenderName as="span">
              {message.senderName || "Anonymous"}
            </SenderName>
          ) : (
            <Tooltip title={message.senderName} side="top" align="start">
              <SenderName as="span">{message.senderName}</SenderName>
            </Tooltip>
          )}
          <Text
            as="span"
            variant="sm"
            css={{
              ml: "$4",
              color: "$textSecondary",
              flexShrink: 0,
            }}
          >
            {formatTime(message.time)}
          </Text>
        </Flex>
        <MessageType
          hasCurrentUserSent={message.sender === localPeerId}
          receiver={message.recipientPeer}
          roles={message.recipientRoles}
        />
        {showPinAction && <ChatActions onPin={onPin} />}
      </Text>
      <Text
        variant="body2"
        css={{
          w: "100%",
          mt: "$2",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
        }}
      >
        <AnnotisedMessage message={message.message} />
      </Text>
    </Flex>
  );
});

export const ChatBody = ({ role, peerId, setPinnedMessage }) => {
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
            onPin={() => setPinnedMessage(message)}
          />
        );
      })}
    </Fragment>
  );
};
