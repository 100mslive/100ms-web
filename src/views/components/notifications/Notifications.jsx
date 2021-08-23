import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  useHMSNotifications,
  HMSNotificationTypes,
  Text,
  PoorConnectivityIcon,
  ConnectivityIcon,
  PersonIcon,
  Button,
  isMobileDevice,
  useHMSActions,
} from "@100mslive/hms-video-react";
import { HMSToastContainer, hmsToast } from "./hms-toast";
import { TrackUnmuteModal } from "./TrackUnmuteModal";

export function Notifications() {
  const notification = useHMSNotifications();
  const hmsActions = useHMSActions();
  const history = useHistory();
  const params = useParams();

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
        // TODO: remove this when chat UI is fixed for mweb
        if (isMobileDevice()) {
          return;
        }
        hmsToast(`New message from ${notification.data?.senderName}`);
        break;
      case HMSNotificationTypes.TRACK_ADDED:
        console.log("[Track Added] data", notification.data);
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
        // show button action when the error is terminal
        if (notification.data?.isTerminal) {
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
        if (notification.data?.code === 3008) {
          const { clearToast } = hmsToast("", {
            center: (
              <div className="flex">
                <Text classes={{ root: "mr-2" }}>
                  {notification.data?.message}
                </Text>
                <Button
                  variant="emphasized"
                  classes={{
                    root: "self-center mr-2",
                  }}
                  onClick={async () => {
                    await hmsActions.unblockAudio();
                    if (clearToast) {
                      clearToast();
                    }
                  }}
                >
                  Unblock
                </Button>
              </div>
            ),
            toastProps: {
              autoClose: false,
            },
          });
          return;
        }
        hmsToast("", {
          left: (
            <Text classes={{ root: "flex" }}>
              {`Error: ${notification.data?.message} - ${notification.data?.description}`}
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
      case HMSNotificationTypes.ROLE_UPDATED:
        if (notification.data?.isLocal) {
          hmsToast("", {
            left: <Text>You are now a {notification.data.roleName}.</Text>,
          });
        }
        break;
      case HMSNotificationTypes.CHANGE_TRACK_STATE_REQUEST:
        const track = notification.data?.track;
        if (!notification.data.enabled) {
          hmsToast("", {
            left: (
              <Text>
                Your {track.source} {track.type} was muted by{" "}
                {notification.data.requestedBy.name}.
              </Text>
            ),
          });
        }
        break;
      case HMSNotificationTypes.REMOVED_FROM_ROOM:
      case HMSNotificationTypes.ROOM_ENDED:
        hmsToast("", {
          left: (
            <Text>
              {`${notification.message}. `}
              {notification.data.reason &&
                `Reason: ${notification.data.reason}`}
            </Text>
          ),
        });
        setTimeout(() => {
          if (params.role) {
            history.push("/leave/" + params.roomId + "/" + params.role);
          } else {
            history.push("/leave/" + params.roomId);
          }
        }, 2000);
        break;
      case HMSNotificationTypes.DEVICE_CHANGE_UPDATE:
        hmsToast("", {
          left: <Text>{notification.message}.</Text>,
        });
        break;
      default:
        break;
    }
  }, [hmsActions, notification]); //eslint-disable-line
  return (
    <>
      <HMSToastContainer />
      <TrackUnmuteModal notification={notification} />
    </>
  );
}
