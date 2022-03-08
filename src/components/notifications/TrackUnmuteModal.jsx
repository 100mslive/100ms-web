import { useState, useEffect } from "react";
import {
  HMSNotificationTypes,
  useHMSActions,
  useHMSNotifications,
} from "@100mslive/react-sdk";
import { RequestDialog } from "../../primitives/DialogContent";
import { MicOnIcon } from "@100mslive/react-icons";

export const TrackUnmuteModal = () => {
  const hmsActions = useHMSActions();
  const notification = useHMSNotifications(
    HMSNotificationTypes.CHANGE_TRACK_STATE_REQUEST
  );
  const [muteNotification, setMuteNotification] = useState(null);

  useEffect(() => {
    if (notification?.data.enabled) {
      setMuteNotification(notification.data);
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
