import React from "react";
import { selectAppData } from "@100mslive/react-sdk";
import {
  ChatIcon,
  ConnectivityIcon,
  HandIcon,
  PersonIcon,
  PoorConnectivityIcon,
} from "@100mslive/react-icons";
import { Button } from "@100mslive/react-ui";
import { hmsActions, hmsStore } from "../../hms";
import { APP_DATA, SIDE_PANE_OPTIONS } from "../../common/constants";

const isChatOpen = () => {
  return (
    hmsStore.getState(selectAppData(APP_DATA.sidePane)) ===
    SIDE_PANE_OPTIONS.CHAT
  );
};

const ChatAction = React.forwardRef((_, ref) => {
  return (
    <Button
      outlined
      as="div"
      variant="standard"
      css={{ w: "max-content" }}
      onClick={() => {
        hmsActions.setAppData(APP_DATA.sidePane, SIDE_PANE_OPTIONS.CHAT);
      }}
      ref={ref}
    >
      Open Chat
    </Button>
  );
});

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
        action: isChatOpen() ? null : <ChatAction />,
      };
    },
    multiple: notifications => {
      return {
        title: `${notifications.length} new messages`,
        icon: <ChatIcon />,
        action: isChatOpen() ? null : <ChatAction />,
      };
    },
  },
  RECONNECTED: {
    single: () => {
      return {
        title: `You are now connected`,
        icon: <ConnectivityIcon />,
        variant: "success",
        duration: 3000,
      };
    },
  },
  RECONNECTING: {
    single: message => {
      return {
        title: `You are offline for now. while we try to reconnect, please check
        your internet connection. ${message}.
      `,
        icon: <PoorConnectivityIcon />,
        variant: "warning",
        duration: 30000,
      };
    },
  },
};
