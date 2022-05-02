import { HandIcon, PersonIcon, ChatIcon } from "@100mslive/react-icons";
import { TextWithIcon } from "../Notifications/TextWithIcon";

export const ToastConfig = {
  PEER_LIST: {
    single: function (notification) {
      if (notification.data.length === 1) {
        return (
          <TextWithIcon
            Icon={PersonIcon}
          >{`${notification.data[0]?.name} joined`}</TextWithIcon>
        );
      }
      return (
        <TextWithIcon Icon={PersonIcon}>
          {`${notification.data[notification.data.length - 1]?.name} and ${
            notification.data.length - 1
          } others joined`}
        </TextWithIcon>
      );
    },
    multiple: notifications => {
      return (
        <TextWithIcon Icon={PersonIcon}>
          {`${notifications[0].data.name} and ${
            notifications.length - 1
          } others joined`}
        </TextWithIcon>
      );
    },
  },
  PEER_JOINED: {
    single: function (notification) {
      return (
        <TextWithIcon
          Icon={PersonIcon}
        >{`${notification.data?.name} joined`}</TextWithIcon>
      );
    },
    multiple: function (notifications) {
      return (
        <TextWithIcon Icon={PersonIcon}>
          {`${notifications[notifications.length - 1].data.name} and ${
            notifications.length - 1
          } others joined`}
        </TextWithIcon>
      );
    },
  },
  PEER_LEFT: {
    single: function (notification) {
      return (
        <TextWithIcon
          Icon={PersonIcon}
        >{`${notification.data?.name} left`}</TextWithIcon>
      );
    },
    multiple: function (notifications) {
      return (
        <TextWithIcon Icon={PersonIcon}>
          {`${notifications[notifications.length - 1].data.name} and ${
            notifications.length - 1
          } others left`}
        </TextWithIcon>
      );
    },
  },
  METADATA_UPDATED: {
    single: notification => {
      return (
        <TextWithIcon
          Icon={HandIcon}
        >{`${notification.data?.name} raised hand`}</TextWithIcon>
      );
    },
    multiple: notifications => {
      return (
        <TextWithIcon Icon={HandIcon}>
          {`${notifications[notifications.length - 1].data?.name} and ${
            notifications.length - 1
          } others raised hand`}
        </TextWithIcon>
      );
    },
  },
  NEW_MESSAGE: {
    single: notification => {
      return (
        <TextWithIcon
          Icon={ChatIcon}
        >{`New message from ${notification.data?.senderName}`}</TextWithIcon>
      );
    },
    multiple: notifications => {
      return (
        <TextWithIcon Icon={ChatIcon}>
          {`${notifications.length} new messages`}
        </TextWithIcon>
      );
    },
  },
};
