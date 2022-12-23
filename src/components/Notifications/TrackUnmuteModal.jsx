import { useEffect, useState } from "react";
import {
  HMSNotificationTypes,
  useHMSActions,
  useHMSNotifications,
} from "@100mslive/react-sdk";
import { MicOnIcon } from "@100mslive/react-icons";
import { RequestDialog } from "../../primitives/DialogContent";

export const TrackUnmuteModal = () => {
  const hmsActions = useHMSActions();
  const notification = useHMSNotifications(
    HMSNotificationTypes.CHANGE_TRACK_STATE_REQUEST
  );
  const endedOrRemovedNotification = useHMSNotifications([
    HMSNotificationTypes.ROOM_ENDED,
    HMSNotificationTypes.REMOVED_FROM_ROOM,
  ]);
  const [muteNotification, setMuteNotification] = useState(null);

  useEffect(() => {
    if (endedOrRemovedNotification?.data.roomEnded) {
      setMuteNotification(null);
    } else if (notification?.data.enabled) {
      setMuteNotification(notification.data);
    }
  }, [notification, endedOrRemovedNotification]);

  if (!muteNotification) {
    return null;
  }

  const { requestedBy: peer, track, enabled } = muteNotification;

  return (
    <RequestDialog
      title="Track Unmute Request"
      onOpenChange={value => !value && setMuteNotification(null)}
      body={`${peer?.name} has requested you to unmute your ${track?.source} ${track?.type}.`}
      onAction={() => {
        hmsActions.setEnabledTrack(track.id, enabled);
        setMuteNotification(null);
      }}
      Icon={MicOnIcon}
    />
  );
};
