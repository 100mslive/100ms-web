import { useEffect } from "react";
import {
  HMSNotificationTypes,
  useHMSNotifications,
} from "@100mslive/react-sdk";
import { PersonIcon } from "@100mslive/react-icons";
import { ToastManager } from "../Toast/ToastManager";
import { TextWithIcon } from "./TextWithIcon";
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
    let toastText = "";
    switch (notification.type) {
      case HMSNotificationTypes.PEER_LIST:
        if (subscribedNotifications.PEER_JOINED) {
          toastText = `${notification.data?.length} peers joined`;
        }
        break;
      case HMSNotificationTypes.PEER_JOINED:
        if (subscribedNotifications.PEER_JOINED) {
          toastText = `${notification.data?.name} joined`;
        }
        break;
      case HMSNotificationTypes.PEER_LEFT:
        if (subscribedNotifications.PEER_LEFT) {
          toastText = `${notification.data?.name} left`;
        }
        break;
      default:
        break;
    }
    if (toastText) {
      ToastManager.addToast({
        title: <TextWithIcon Icon={PersonIcon}>{toastText}</TextWithIcon>,
      });
    }
  }, [
    notification,
    subscribedNotifications.PEER_JOINED,
    subscribedNotifications.PEER_LEFT,
  ]);

  return null;
};
