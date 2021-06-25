import React, { useEffect } from "react";
import {
  useHMSNotifications,
  HMSNotificationTypes,
  hmsToast,
  HMSToastContainer,
  Text,
  PoorConnectivityIcon,
  ConnectivityIcon,
} from "@100mslive/hms-video-react";

export function Notifications() {
  const notification = useHMSNotifications();

  useEffect(() => {
    if (!notification) {
      return;
    }
    switch (notification.type) {
      case HMSNotificationTypes.PEER_JOINED:
        hmsToast(`${notification.data?.name} joined`);
        break;
      case HMSNotificationTypes.PEER_LEFT:
        hmsToast(`${notification.data?.name} left`);
        break;
      case HMSNotificationTypes.NEW_MESSAGE:
        hmsToast(`New message from ${notification.data?.senderName}`);
        break;
      case HMSNotificationTypes.TRACK_ADDED:
        console.log("[Track Added]", notification);
        break;
      case HMSNotificationTypes.TRACK_REMOVED:
        console.log("[Track Removed]", notification);
        break;
      case HMSNotificationTypes.TRACK_MUTED:
        console.log("[Track Muted]", notification);
        break;
      case HMSNotificationTypes.TRACK_UNMUTED:
        console.log("[Track Unmuted]", notification);
        break;
      case HMSNotificationTypes.ERROR:
        hmsToast(`Error: ${notification.data?.message}`);
        break;
      case HMSNotificationTypes.RECONNECTED:
        hmsToast("", {
          left: (
            <Text classes={{ root: "flex" }}>
              <ConnectivityIcon /> &nbsp;You are now connected
            </Text>
          ),
        });
        break;
      case HMSNotificationTypes.RECONNECTING:
        hmsToast("", {
          left: (
            <Text classes={{ root: "flex" }}>
              <PoorConnectivityIcon /> &nbsp;Poor internet. Please check your
              internet connection.
            </Text>
          ),
        });
        break;
      default:
        break;
    }
  }, [notification]);
  return <HMSToastContainer />;
}
