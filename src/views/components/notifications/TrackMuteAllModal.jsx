import { useState, useEffect } from "react";
import {
  Button,
  HMSNotificationTypes,
  MessageModal,
  useHMSActions,
} from "@100mslive/hms-video-react";

export const TrackMuteAllModal = ({ notification }) => {
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
    <MessageModal
      show
      onClose={() => setMuteNotification(null)}
      title="Track Unmute Request"
      body={`${peer?.name} requested to unmute your tracks`}
      footer={
        <div className="flex space-x-1">
          <Button
            onClick={() => {
              tracks.forEach(track => {
                hmsActions.setEnabledTrack(track.id, enabled);
              });
              setMuteNotification(null);
            }}
          >
            Accept
          </Button>
        </div>
      }
    />
  );
};
