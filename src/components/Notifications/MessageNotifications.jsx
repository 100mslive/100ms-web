import { useContext, useEffect } from "react";
import {
  HMSNotificationTypes,
  useHMSNotifications,
} from "@100mslive/react-sdk";
import { ToastBatcher } from "../Toast/ToastBatcher";
import { AppContext } from "../context/AppContext";
import { useIsHeadless } from "../AppData/useUISettings";

export const MessageNotifications = () => {
  const notification = useHMSNotifications(HMSNotificationTypes.NEW_MESSAGE);
  const { subscribedNotifications = {} } = useContext(AppContext);
  const isHeadless = useIsHeadless();
  useEffect(() => {
    if (!notification) {
      return;
    }
    console.debug(`[${notification.type}]`, notification);
    if (
      !subscribedNotifications.NEW_MESSAGE ||
      notification.data?.ignored ||
      isHeadless
    ) {
      return;
    }
    ToastBatcher.showToast({ notification });
  }, [notification, subscribedNotifications.NEW_MESSAGE, isHeadless]);

  return null;
};
