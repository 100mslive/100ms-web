import { useEffect, useState } from "react";
import { logMessage } from "zipyai";
import {
  HMSNotificationTypes,
  useHMSNotifications,
} from "@100mslive/react-sdk";
import { Dialog, Flex, Loading, Text } from "@100mslive/roomkit-react";
import { ToastConfig } from "../Toast/ToastConfig";
import { ToastManager } from "../Toast/ToastManager";

const notificationTypes = [
  HMSNotificationTypes.RECONNECTED,
  HMSNotificationTypes.RECONNECTING,
  HMSNotificationTypes.ERROR,
];
let notificationId = null;

const isQA = process.env.REACT_APP_ENV === "qa";
export const ReconnectNotifications = () => {
  const notification = useHMSNotifications(notificationTypes);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (
      notification?.type === HMSNotificationTypes.ERROR &&
      notification?.data?.isTerminal
    ) {
      logMessage("Error ", notification.data?.description);
      setOpen(false);
    } else if (notification?.type === HMSNotificationTypes.RECONNECTED) {
      logMessage("Reconnected");
      notificationId = ToastManager.replaceToast(
        notificationId,
        ToastConfig.RECONNECTED.single()
      );
      setOpen(false);
    } else if (notification?.type === HMSNotificationTypes.RECONNECTING) {
      logMessage("Reconnecting");
      if (isQA) {
        ToastManager.removeToast(notificationId);
        setOpen(true);
      } else {
        notificationId = ToastManager.replaceToast(
          notificationId,
          ToastConfig.RECONNECTING.single(notification.data.message)
        );
      }
    }
  }, [notification]);
  if (!open || !isQA) return null;
  return (
    <Dialog.Root open={open} modal={true}>
      <Dialog.Portal container={document.getElementById("conferencing")}>
        <Dialog.Overlay />
        <Dialog.Content
          css={{
            width: "fit-content",
            maxWidth: "80%",
            p: "$4 $8",
            position: "relative",
            top: "unset",
            bottom: "$9",
            transform: "translate(-50%, -100%)",
            animation: "none !important",
          }}
        >
          <Flex align="center">
            <div style={{ display: "inline", margin: "0.25rem" }}>
              <Loading size={16} />
            </div>
            <Text css={{ fontSize: "$space$8", color: "$on_surface_high" }}>
              You lost your network connection. Trying to reconnect.
            </Text>
          </Flex>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
