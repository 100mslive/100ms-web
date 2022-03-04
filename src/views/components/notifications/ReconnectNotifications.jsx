import { useEffect } from "react";
import LogRocket from "logrocket";
import {
  HMSNotificationTypes,
  useHMSNotifications,
} from "@100mslive/react-sdk";
import { ToastManager } from "../../new/Toast/ToastManager";
import { TextWithIcon } from "./TextWithIcon";
import { ConnectivityIcon, PoorConnectivityIcon } from "@100mslive/react-icons";

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
      notificationId = ToastManager.replaceToast(notificationId, {
        title: (
          <TextWithIcon Icon={ConnectivityIcon}>
            You are now connected
          </TextWithIcon>
        ),
        duration: 3000,
      });
    } else if (notification?.type === HMSNotificationTypes.RECONNECTING) {
      LogRocket.track("Reconnecting");
      notificationId = ToastManager.replaceToast(notificationId, {
        title: (
          <TextWithIcon Icon={PoorConnectivityIcon}>
            You are offline for now. while we try to reconnect, please check
            your internet connection.
          </TextWithIcon>
        ),
        duration: 10000,
      });
    }
  }, [notification]);
  return null;
};
