import { useState, useEffect } from "react";
import { HMSNotificationTypes, useHMSActions } from "@100mslive/react-sdk";
import { RequestDialog } from "../../new/DialogContent";

export const TrackBulkUnmuteModal = ({ notification }) => {
  const hmsActions = useHMSActions();
  const [muteNotification, setMuteNotification] = useState(null);

  useEffect(() => {
    if (!notification || !notification.data) {
      return;
    }
    if (
      notification.type ===
        HMSNotificationTypes.CHANGE_MULTI_TRACK_STATE_REQUEST &&
      notification.data.enabled
    ) {
      setMuteNotification(notification.data);
    }
  }, [notification]);

  if (!muteNotification) {
    return null;
  }

  const { requestedBy: peer, tracks, enabled } = muteNotification;

  return (
    <RequestDialog
      title="Track Unmute Request"
      body={`${peer?.name} requested to unmute your tracks`}
      onOpenChange={value => value && setMuteNotification(null)}
      onAction={() => {
        tracks.forEach(track => {
          hmsActions.setEnabledTrack(track.id, enabled);
        });
        setMuteNotification(null);
      }}
    />
  );
};
