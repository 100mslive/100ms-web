import { useEffect } from "react";
import {
  HMSNotificationTypes,
  useHMSNotifications,
} from "@100mslive/react-sdk";

const notificationTypes = [
  HMSNotificationTypes.TRACK_ADDED,
  HMSNotificationTypes.TRACK_REMOVED,
  HMSNotificationTypes.TRACK_MUTED,
  HMSNotificationTypes.TRACK_UNMUTED,
];
export const TrackNotifications = () => {
  const notification = useHMSNotifications(notificationTypes);
  useEffect(() => {
    if (notification) {
      console.debug(`[${notification.type}]`, notification);
    }
  }, [notification]);

  return null;
};
