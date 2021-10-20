import { useState } from "react";
import {
  Button,
  HMSNotificationTypes,
  MessageModal,
  useHMSActions,
} from "@100mslive/hms-video-react";
import { useEffect } from "react";

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
    <MessageModal
      show
      onClose={() => setMuteNotification(null)}
      title="Track Unmute Request"
      body={`${peer?.name} requested to unmute your ${track?.source} ${track?.type}`}
      footer={
        <div className="flex space-x-1">
          <Button
            onClick={() => {
              hmsActions.setEnabledTrack(track.id, enabled);
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
