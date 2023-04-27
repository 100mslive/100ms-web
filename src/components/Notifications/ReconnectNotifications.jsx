import { useEffect } from "react";
import { logMessage } from "zipyai";
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
      logMessage("Reconnected");
      notificationId = ToastManager.replaceToast(
        notificationId,
        ToastConfig.RECONNECTED.single()
      );
    } else if (notification?.type === HMSNotificationTypes.RECONNECTING) {
      logMessage("Reconnecting");
      notificationId = ToastManager.replaceToast(
        notificationId,
        ToastConfig.RECONNECTING.single(notification.data.message)
      );
    }
  }, [notification]);
  return null;
};
