/* eslint-disable no-case-declarations */
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogRocket from "logrocket";
import {
  useHMSNotifications,
  HMSNotificationTypes,
} from "@100mslive/react-sdk";
import { Flex, Text, Button } from "@100mslive/react-ui";
import { TrackUnmuteModal } from "./TrackUnmuteModal";
import { AutoplayBlockedModal } from "./AutoplayBlockedModal";
import { InitErrorModal } from "./InitErrorModal";
import { TrackBulkUnmuteModal } from "./TrackBulkUnmuteModal";
import { ToastManager } from "../Toast/ToastManager";
import { AppContext } from "../context/AppContext";
import { TrackNotifications } from "./TrackNotifications";
import { PeerNotifications } from "./PeerNotifications";
import { ReconnectNotifications } from "./ReconnectNotifications";
import { getMetadata } from "../../common/utils";
import { ToastBatcher } from "../Toast/ToastBatcher";
import { useIsHeadless } from "../AppData/useUISettings";

export function Notifications() {
  const notification = useHMSNotifications();
  const navigate = useNavigate();
  const { subscribedNotifications, HLS_VIEWER_ROLE } = useContext(AppContext);
  const isHeadless = useIsHeadless();
  useEffect(() => {
    if (!notification) {
      return;
    }
    switch (notification.type) {
      case HMSNotificationTypes.METADATA_UPDATED:
        // Don't toast message when metadata is updated and raiseHand is false.
        // Don't toast message in case of local peer.
        const metadata = getMetadata(notification.data?.metadata);
        if (!metadata?.isHandRaised || notification.data.isLocal || isHeadless)
          return;

        console.debug("Metadata updated", notification.data);
        if (!subscribedNotifications.METADATA_UPDATED) return;
        ToastBatcher.showToast({ notification });
        break;
      case HMSNotificationTypes.NAME_UPDATED:
        console.log(
          notification.data.id +
            " changed their name to " +
            notification.data.name
        );
        break;
      case HMSNotificationTypes.NEW_MESSAGE:
        if (
          !subscribedNotifications.NEW_MESSAGE ||
          notification.data?.ignored ||
          isHeadless
        )
          return;
        ToastBatcher.showToast({ notification });
        break;
      case HMSNotificationTypes.ERROR:
        if (
          notification.data?.isTerminal &&
          notification.data?.action !== "INIT"
        ) {
          if ([500, 6008].includes(notification.data?.code)) {
            ToastManager.addToast({
              title: `Error: ${notification.data?.message}`,
            });
          } else {
            LogRocket.track("Disconnected");
            // show button action when the error is terminal
            const toastId = ToastManager.addToast({
              title: (
                <Flex justify="between" css={{ w: "100%" }}>
                  <Text css={{ mr: "$4" }}>
                    {notification.data?.message ||
                      "We couldn’t reconnect you. When you’re back online, try joining the room."}
                  </Text>
                  <Button
                    variant="primary"
                    css={{ mr: "$4" }}
                    onClick={() => {
                      ToastManager.removeToast(toastId);
                      window.location.reload();
                    }}
                  >
                    Rejoin
                  </Button>
                </Flex>
              ),
              close: false,
            });
          }
          // goto leave for terminal if any action is not performed within 2secs
          // if network is still unavailable going to preview will throw an error
          setTimeout(() => {
            const previewLocation = window.location.pathname.replace(
              "meeting",
              "leave"
            );
            ToastManager.clearAllToast();
            navigate(previewLocation);
          }, 2000);
          return;
        }
        // Autoplay error or user denied screen share(cancelled browser pop-up)
        if (
          notification.data?.code === 3008 ||
          (notification.data?.code === 3001 &&
            notification.data?.message.includes("screen"))
        ) {
          return;
        }
        if (notification.data?.action === "INIT") {
          return;
        }
        if (!subscribedNotifications.ERROR) return;
        ToastManager.addToast({
          title: `Error: ${notification.data?.message} - ${notification.data?.description}`,
        });
        break;
      case HMSNotificationTypes.ROLE_UPDATED:
        if (notification.data.roleName === HLS_VIEWER_ROLE) {
          return;
        }
        if (notification.data?.isLocal) {
          ToastManager.addToast({
            title: `You are now a ${notification.data.roleName}`,
          });
        }
        break;
      case HMSNotificationTypes.CHANGE_TRACK_STATE_REQUEST:
        const track = notification.data?.track;
        if (!notification.data.enabled) {
          ToastManager.addToast({
            title: `Your ${track.source} ${track.type} was muted by
                ${notification.data.requestedBy?.name}.`,
          });
        }
        break;
      case HMSNotificationTypes.REMOVED_FROM_ROOM:
      case HMSNotificationTypes.ROOM_ENDED:
        ToastManager.addToast({
          title: `${notification.message}. 
              ${
                notification.data.reason &&
                `Reason: ${notification.data.reason}`
              }`,
        });
        setTimeout(() => {
          const leaveLocation = window.location.pathname.replace(
            "meeting",
            "leave"
          );
          navigate(leaveLocation);
        }, 2000);
        break;
      case HMSNotificationTypes.DEVICE_CHANGE_UPDATE:
        ToastManager.addToast({
          title: notification.message,
        });
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    notification,
    subscribedNotifications.ERROR,
    subscribedNotifications.NEW_MESSAGE,
    subscribedNotifications.METADATA_UPDATED,
    HLS_VIEWER_ROLE,
  ]);

  return (
    <>
      {!isHeadless && <TrackUnmuteModal />}
      {!isHeadless && <TrackBulkUnmuteModal />}
      <TrackNotifications />
      <PeerNotifications />
      <ReconnectNotifications />
      <AutoplayBlockedModal />
      <InitErrorModal notification={notification} />
    </>
  );
}
