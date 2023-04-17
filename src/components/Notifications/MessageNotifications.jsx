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
import { useIsFeatureEnabled } from "../hooks/useFeatures";
import { FEATURE_LIST, SUBSCRIBED_NOTIFICATIONS } from "../../common/constants";

export const MessageNotifications = () => {
  const notification = useHMSNotifications(HMSNotificationTypes.NEW_MESSAGE);
  const isChatEnabled = useIsFeatureEnabled(FEATURE_LIST.CHAT);
  const isNewMessageSubscribed = useSubscribedNotifications(
    SUBSCRIBED_NOTIFICATIONS.NEW_MESSAGE
  );
  const isHeadless = useIsHeadless();
  useEffect(() => {
    if (!notification) {
      return;
    }
    console.debug(`[${notification.type}]`, notification);
    if (
      !isNewMessageSubscribed ||
      notification.data?.ignored ||
      !isChatEnabled
    ) {
      return;
    }
    ToastBatcher.showToast({ notification });
  }, [notification, isNewMessageSubscribed, isHeadless, isChatEnabled]);

  return null;
};
