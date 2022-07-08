import React, { useContext } from "react";
import {
  AlertOctagonIcon,
  ChatIcon,
  ExitIcon,
  HandIcon,
  PersonIcon,
} from "@100mslive/react-icons";
import { Box } from "@100mslive/react-ui";
import SwitchWithLabel from "./SwitchWithLabel";
import { AppContext } from "../context/AppContext";

const NotificationItem = ({ onClick, type, label, icon, checked }) => {
  return (
    <SwitchWithLabel
      label={label}
      id={type}
      icon={icon}
      checked={checked}
      onChange={value => {
        onClick({
          type,
          isSubscribed: value,
        });
      }}
    />
  );
};

export const NotificationSettings = () => {
  const { subscribedNotifications, setSubscribedNotifications } =
    useContext(AppContext);

  return (
    <Box>
      <NotificationItem
        label="Peer Joined"
        type="PEER_JOINED"
        icon={<PersonIcon />}
        onClick={setSubscribedNotifications}
        checked={subscribedNotifications.PEER_JOINED}
      />
      <NotificationItem
        label="Peer Leave"
        type="PEER_LEFT"
        icon={<ExitIcon />}
        onClick={setSubscribedNotifications}
        checked={subscribedNotifications.PEER_LEFT}
      />
      <NotificationItem
        label="New Message"
        type="NEW_MESSAGE"
        icon={<ChatIcon />}
        onClick={setSubscribedNotifications}
        checked={subscribedNotifications.NEW_MESSAGE}
      />
      <NotificationItem
        label="Hand Raised"
        type="METADATA_UPDATED"
        icon={<HandIcon />}
        onClick={setSubscribedNotifications}
        checked={subscribedNotifications.METADATA_UPDATED}
      />
      <NotificationItem
        label="Error"
        type="ERROR"
        icon={<AlertOctagonIcon />}
        onClick={setSubscribedNotifications}
        checked={subscribedNotifications.ERROR}
      />
    </Box>
  );
};
