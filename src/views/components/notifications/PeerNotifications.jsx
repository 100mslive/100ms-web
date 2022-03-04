import { useContext, useEffect } from "react";
import {
  HMSNotificationTypes,
  useHMSNotifications,
} from "@100mslive/react-sdk";
import { AppContext } from "../../../store/AppContext";
import { ToastManager } from "../../new/Toast/ToastManager";
import { TextWithIcon } from "./TextWithIcon";
import { PersonIcon } from "@100mslive/react-icons";

export const PeerNotifications = () => {
  const notification = useHMSNotifications([
    HMSNotificationTypes.PEER_LIST,
    HMSNotificationTypes.PEER_JOINED,
    HMSNotificationTypes.PEER_LEFT,
  ]);
  const { subscribedNotifications } = useContext(AppContext);
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
    toastText &&
      ToastManager.addToast({
        title: <TextWithIcon Icon={PersonIcon}>{toastText}</TextWithIcon>,
      });
  }, [
    notification,
    subscribedNotifications.PEER_JOINED,
    subscribedNotifications.PEER_LEFT,
  ]);

  return null;
};
