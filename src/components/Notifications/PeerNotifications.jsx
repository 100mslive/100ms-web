import { useEffect } from "react";
import {
  HMSNotificationTypes,
  useHMSNotifications,
} from "@100mslive/react-sdk";
import { ToastBatcher } from "../Toast/ToastBatcher";

import {
  UserPreferencesKeys,
  useUserPreferences,
} from "../hooks/useUserPreferences";

const notificationTypes = [
  HMSNotificationTypes.PEER_LIST,
  HMSNotificationTypes.PEER_JOINED,
  HMSNotificationTypes.PEER_LEFT,
];

export const PeerNotifications = () => {
  const notification = useHMSNotifications(notificationTypes);
  const [{ subscribedNotifications }] = useUserPreferences(
    UserPreferencesKeys.UI_SETTINGS
  );
  useEffect(() => {
    if (!notification) {
      return;
    }
    console.debug(`[${notification.type}]`, notification);

    switch (notification.type) {
      case HMSNotificationTypes.PEER_LIST:
      case HMSNotificationTypes.PEER_JOINED:
        if (!subscribedNotifications.PEER_JOINED) {
          return;
        }
        break;
      case HMSNotificationTypes.PEER_LEFT:
        if (!subscribedNotifications.PEER_LEFT) {
          return;
        }
        break;
      default:
        return;
    }
    ToastBatcher.showToast({ notification });
  }, [
    notification,
    subscribedNotifications.PEER_JOINED,
    subscribedNotifications.PEER_LEFT,
  ]);

  return null;
};
