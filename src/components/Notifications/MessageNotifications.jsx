import { useEffect } from "react";
import {
  HMSNotificationTypes,
  useHMSNotifications,
} from "@100mslive/react-sdk";
import { ToastBatcher } from "../Toast/ToastBatcher";
import {
  useIsHeadless,
  useSubscribedNotifications,
} from "../AppData/useUISettings";
import { SUBSCRIBED_NOTIFICATIONS } from "../../common/constants";

export const MessageNotifications = () => {
  const notification = useHMSNotifications(HMSNotificationTypes.NEW_MESSAGE);
  const NEW_MESSAGE = useSubscribedNotifications(
    SUBSCRIBED_NOTIFICATIONS.NEW_MESSAGE
  );
  const isHeadless = useIsHeadless();
  useEffect(() => {
    if (!notification) {
      return;
    }
    console.debug(`[${notification.type}]`, notification);
    if (!NEW_MESSAGE || notification.data?.ignored || isHeadless) {
      return;
    }
    ToastBatcher.showToast({ notification });
  }, [notification, NEW_MESSAGE, isHeadless]);

  return null;
};
