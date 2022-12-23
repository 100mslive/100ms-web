import { useEffect } from "react";
import LogRocket from "logrocket";
import {
  HMSNotificationTypes,
  useHMSNotifications,
} from "@100mslive/react-sdk";
import { ToastConfig } from "../Toast/ToastConfig";
import { ToastManager } from "../Toast/ToastManager";

const notificationTypes = [
  HMSNotificationTypes.RECONNECTED,
  HMSNotificationTypes.RECONNECTING,
];
let notificationId = null;
export const ReconnectNotifications = () => {
  const notification = useHMSNotifications(notificationTypes);
  useEffect(() => {
    if (notification?.type === HMSNotificationTypes.RECONNECTED) {
      LogRocket.track("Reconnected");
      notificationId = ToastManager.replaceToast(
        notificationId,
        ToastConfig.RECONNECTED.single()
      );
    } else if (notification?.type === HMSNotificationTypes.RECONNECTING) {
      LogRocket.track("Reconnecting");
      notificationId = ToastManager.replaceToast(
        notificationId,
        ToastConfig.RECONNECTING.single(notification.data.message)
      );
    }
  }, [notification]);
  return null;
};
