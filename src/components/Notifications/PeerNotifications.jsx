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
  const isPeerJoinSubscribed = useSubscribedNotifications(
    SUBSCRIBED_NOTIFICATIONS.PEER_JOINED
  );
  const isPeerLeftSubscribed = useSubscribedNotifications(
    SUBSCRIBED_NOTIFICATIONS.PEER_LEFT
  );
  useEffect(() => {
    if (!notification) {
      return;
    }
    console.debug(`[${notification.type}]`, notification);
    switch (notification.type) {
      case HMSNotificationTypes.PEER_LIST:
        if (!isPeerJoinSubscribed || notification.data?.length === 0) {
          return;
        }
        break;
      case HMSNotificationTypes.PEER_JOINED:
        if (!isPeerJoinSubscribed) {
          return;
        }
        break;
      case HMSNotificationTypes.PEER_LEFT:
        if (!isPeerLeftSubscribed) {
          return;
        }
        break;
      default:
        return;
    }
    ToastBatcher.showToast({ notification });
  }, [notification, isPeerJoinSubscribed, isPeerLeftSubscribed]);

  return null;
};
