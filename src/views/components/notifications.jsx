import React, { useEffect } from "react";
import {
  useHMSNotifications,
  HMSNotificationTypes,
  hmsToast,
  HMSToastContainer,
  Text,
  PoorConnectivityIcon,
  ConnectivityIcon,
  PersonIcon,
  Button,
} from "@100mslive/hms-video-react";

export function Notifications() {
  const notification = useHMSNotifications();

  useEffect(() => {
    if (!notification) {
      return;
    }
    switch (notification.type) {
      case HMSNotificationTypes.PEER_JOINED:
        console.log("[Peer Joined]", notification.data);
        break;
      case HMSNotificationTypes.PEER_LEFT:
        hmsToast("", {
          left: (
            <Text classes={{ root: "flex" }}>
              <PersonIcon className="mr-2" />
              {notification.data?.name} left
            </Text>
          ),
        });
        break;
      case HMSNotificationTypes.NEW_MESSAGE:
        hmsToast(`New message from ${notification.data?.senderName}`);
        break;
      case HMSNotificationTypes.TRACK_ADDED:
        console.log("[Track Added]", notification);
        break;
      case HMSNotificationTypes.TRACK_REMOVED:
        console.log("[Track Removed]", notification);
        break;
      case HMSNotificationTypes.TRACK_MUTED:
        console.log("[Track Muted]", notification);
        break;
      case HMSNotificationTypes.TRACK_UNMUTED:
        console.log("[Track Unmuted]", notification);
        break;
      case HMSNotificationTypes.ERROR:
        // TODO export error codes from sdk
        if ([1003, 4005].includes(notification.data?.code)) {
          hmsToast("", {
            center: (
              <div className="flex">
                <Text classes={{ root: "mr-2" }}>
                  We couldn’t reconnect you. When you’re back online, try
                  joining the room.
                </Text>
                <Button
                  variant="emphasized"
                  classes={{
                    root: "self-center mr-2",
                  }}
                  onClick={() => window.location.reload()}
                >
                  Rejoin
                </Button>
              </div>
            ),
          });
          return;
        }
        hmsToast("", {
          left: (
            <Text classes={{ root: "flex" }}>
              Error: {notification.data?.message}
            </Text>
          ),
        });
        break;
      case HMSNotificationTypes.RECONNECTED:
        hmsToast("", {
          left: (
            <Text classes={{ root: "flex" }}>
              <ConnectivityIcon className="mr-2" /> You are now connected
            </Text>
          ),
        });
        break;
      case HMSNotificationTypes.RECONNECTING:
        hmsToast("", {
          left: (
            <Text classes={{ root: "flex" }}>
              <PoorConnectivityIcon className="mr-2" /> You are offline for now.
              while we try to reconnect, please check your internet connection.
            </Text>
          ),
        });
        break;
      default:
        break;
    }
  }, [notification]);
  return <HMSToastContainer />;
}
