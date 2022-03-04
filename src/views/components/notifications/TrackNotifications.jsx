import { useEffect } from "react";
import {
  HMSNotificationTypes,
  useHMSNotifications,
} from "@100mslive/react-sdk";

export const TrackNotifications = () => {
  const notification = useHMSNotifications([
    HMSNotificationTypes.TRACK_ADDED,
    HMSNotificationTypes.TRACK_REMOVED,
    HMSNotificationTypes.TRACK_MUTED,
    HMSNotificationTypes.TRACK_UNMUTED,
  ]);
  useEffect(() => {
    if (notification) {
      console.debug(`[${notification.type}]`, notification);
    }
  }, [notification]);

  return null;
};
