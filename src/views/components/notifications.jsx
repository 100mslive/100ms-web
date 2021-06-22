import React, { useEffect } from "react";
import {
  useHMSNotifications,
  HMSNotificationTypes,
} from "@100mslive/hms-video-react";

export function Notifications() {
  const notification = useHMSNotifications();

  useEffect(() => {
    if (!notification) {
      return;
    }
    switch (notification.type) {
      case HMSNotificationTypes.PEER_JOINED:
        console.log("[Peer Joined]", notification);
        break;
      case HMSNotificationTypes.PEER_LEFT:
        console.log("[Peer Left]", notification);
        break;
      case HMSNotificationTypes.NEW_MESSAGE:
        console.log("[New Message]", notification);
        break;
      case HMSNotificationTypes.TRACK_ADDED:
        console.log("[Track Added]", notification);
        break;
      case HMSNotificationTypes.TRACK_REMOVED:
        console.log("[Track  Removed]", notification);
        break;
      case HMSNotificationTypes.TRACK_MUTED:
        console.log("[Track Muted]", notification);
        break;
      case HMSNotificationTypes.TRACK_UNMUTED:
        console.log("[Track Unmuted]", notification);
        break;
      case HMSNotificationTypes.ERROR:
        console.log("[Error]", notification);
        break;
      case HMSNotificationTypes.RECONNECTED:
        console.log("[Reconnected]", notification);
        break;
      case HMSNotificationTypes.RECONNECTING:
        console.log("[Reconnecting]", notification);
        break;
      default:
        break;
    }
  }, [notification]);
  return <div></div>;
}
