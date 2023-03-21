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
  const notification = useHMSNotifications([
    HMSNotificationTypes.CHANGE_TRACK_STATE_REQUEST,
    HMSNotificationTypes.ROOM_ENDED,
    HMSNotificationTypes.REMOVED_FROM_ROOM,
  ]);
  const [muteNotification, setMuteNotification] = useState(null);

  useEffect(() => {
    switch (notification?.type) {
      case HMSNotificationTypes.REMOVED_FROM_ROOM:
      case HMSNotificationTypes.ROOM_ENDED:
        setMuteNotification(null);
        break;
      case HMSNotificationTypes.CHANGE_TRACK_STATE_REQUEST:
        if (notification?.data.enabled) {
          setMuteNotification(notification.data);
        }
        break;
      default:
        return;
    }
  }, [notification]);

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
