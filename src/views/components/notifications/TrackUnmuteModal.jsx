import { useState, useEffect } from "react";
import { HMSNotificationTypes, useHMSActions } from "@100mslive/react-sdk";
import { RequestDialog } from "../../new/DialogContent";

export const TrackUnmuteModal = ({ notification }) => {
  const hmsActions = useHMSActions();
  const [muteNotification, setMuteNotification] = useState(null);

  useEffect(() => {
    if (!notification || !notification.data) {
      return;
    }
    if (
      notification.type === HMSNotificationTypes.CHANGE_TRACK_STATE_REQUEST &&
      notification.data.enabled
    ) {
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
      body={`${peer?.name} requested to unmute your {track?.source} ${track?.type}`}
      onAction={() => {
        hmsActions.setEnabledTrack(track.id, enabled);
        setMuteNotification(null);
      }}
    />
  );
};
