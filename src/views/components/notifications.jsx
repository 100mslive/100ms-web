import React, { useEffect } from "react";
import {
  useHMSNotifications,
  HMSNotificationTypes,
  hmsToast,
  HMSToastContainer,
} from "@100mslive/hms-video-react";

export function Notifications() {
  const notification = useHMSNotifications();

  useEffect(() => {
    if (!notification) {
      return;
    }
    switch (notification.type) {
      case HMSNotificationTypes.PEER_JOINED:
        hmsToast(`${notification.data?.name} Joined`);
        break;
      case HMSNotificationTypes.PEER_LEFT:
        hmsToast(`${notification.data?.name} Left`);
        break;
      case HMSNotificationTypes.NEW_MESSAGE:
        hmsToast(
          `New Message: ${notification.data?.message} from ${notification.data?.senderName}`
        );
        break;
      case HMSNotificationTypes.TRACK_ADDED:
        console.log(notification.data, "track added");
        hmsToast(
          `${notification.data?.type} Track: ${notification.data?.id} added`
        );
        break;
      case HMSNotificationTypes.TRACK_REMOVED:
        hmsToast(
          `${notification.data?.type} Track: ${notification.data?.id} removed`
        );
        break;
      case HMSNotificationTypes.TRACK_MUTED:
        hmsToast(
          `${notification.data?.type} Track: ${notification.data?.id} muted`
        );
        break;
      case HMSNotificationTypes.TRACK_UNMUTED:
        hmsToast(
          `${notification.data?.type} Track: ${notification.data?.id} unmuted`
        );
        break;
      case HMSNotificationTypes.ERROR:
        hmsToast(`Error: ${notification.data?.message}`);
        break;
      case HMSNotificationTypes.RECONNECTED:
        hmsToast("Reconnected");
        break;
      case HMSNotificationTypes.RECONNECTING:
        hmsToast(`Reconnecting: ${notification.data?.message}`);
        break;
      default:
        break;
    }
  }, [notification]);
  return <HMSToastContainer />;
}
