import { HandIcon, PersonIcon, ChatIcon } from "@100mslive/react-icons";

export const ToastConfig = {
  PEER_LIST: {
    single: function (notification) {
      if (notification.data.length === 1) {
        return {
          title: `${notification.data[0]?.name} joined`,
          icon: <PersonIcon />,
        };
      }
      return {
        title: `${notification.data[notification.data.length - 1]?.name} and ${
          notification.data.length - 1
        } others joined`,
        icon: <PersonIcon />,
      };
    },
    multiple: notifications => {
      return {
        title: `${notifications[0].data.name} and ${
          notifications.length - 1
        } others joined`,
        icon: <PersonIcon />,
      };
    },
  },
  PEER_JOINED: {
    single: function (notification) {
      return {
        title: `${notification.data?.name} joined`,
        icon: <PersonIcon />,
      };
    },
    multiple: function (notifications) {
      return {
        title: `${notifications[notifications.length - 1].data.name} and ${
          notifications.length - 1
        } others joined`,
        icon: <PersonIcon />,
      };
    },
  },
  PEER_LEFT: {
    single: function (notification) {
      return {
        title: `${notification.data?.name} left`,
        icon: <PersonIcon />,
      };
    },
    multiple: function (notifications) {
      return {
        title: `${notifications[notifications.length - 1].data.name} and ${
          notifications.length - 1
        } others left`,
        icon: <PersonIcon />,
      };
    },
  },
  METADATA_UPDATED: {
    single: notification => {
      return {
        title: `${notification.data?.name} raised hand`,
        icon: <HandIcon />,
      };
    },
    multiple: notifications => {
      return {
        title: `${notifications[notifications.length - 1].data?.name} and ${
          notifications.length - 1
        } others raised hand`,
        icon: <HandIcon />,
      };
    },
  },
  NEW_MESSAGE: {
    single: notification => {
      return {
        title: `New message from ${notification.data?.senderName}`,
        icon: <ChatIcon />,
      };
    },
    multiple: notifications => {
      return {
        title: `${notifications.length} new messages`,
        icon: <ChatIcon />,
      };
    },
  },
};
