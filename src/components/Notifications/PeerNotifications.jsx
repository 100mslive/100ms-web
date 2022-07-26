import { useEffect } from "react";
import {
  HMSNotificationTypes,
  useHMSNotifications,
} from "@100mslive/react-sdk";
import { ToastBatcher } from "../Toast/ToastBatcher";
import { useSubscribedNotifications } from "../AppData/useUISettings";
import { SUBSCRIBED_NOTIFICATIONS } from "../../common/constants";

const notificationTypes = [
  HMSNotificationTypes.PEER_LIST,
  HMSNotificationTypes.PEER_JOINED,
  HMSNotificationTypes.PEER_LEFT,
];

export const PeerNotifications = () => {
  const notification = useHMSNotifications(notificationTypes);
  const PEER_JOINED = useSubscribedNotifications(
    SUBSCRIBED_NOTIFICATIONS.PEER_JOINED
  );
  const PEER_LEFT = useSubscribedNotifications(
    SUBSCRIBED_NOTIFICATIONS.PEER_LEFT
  );
  useEffect(() => {
    if (!notification) {
      return;
    }
    console.debug(`[${notification.type}]`, notification);
    switch (notification.type) {
      case HMSNotificationTypes.PEER_LIST:
      case HMSNotificationTypes.PEER_JOINED:
        if (!PEER_JOINED) {
          return;
        }
        break;
      case HMSNotificationTypes.PEER_LEFT:
        if (!PEER_LEFT) {
          return;
        }
        break;
      default:
        return;
    }
    ToastBatcher.showToast({ notification });
  }, [notification, PEER_JOINED, PEER_LEFT]);

  return null;
};
