import { useState, useEffect } from "react";
import {
  Button,
  HMSNotificationTypes,
  MessageModal,
  useHMSActions,
} from "@100mslive/hms-video-react";

export const TrackMuteAllModal = ({ notification }) => {
  const hmsActions = useHMSActions();
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    setShowModal(
      Boolean(
        notification &&
          notification.type ===
            HMSNotificationTypes.CHANGE_MULTI_TRACK_STATE_REQUEST &&
          notification.data?.enabled
      )
    );
  }, [notification]);

  if (!notification || !notification.data) {
    return null;
  }
  const { requestedBy: peer, tracks, enabled } = notification.data;

  return (
    <MessageModal
      show={showModal}
      onClose={() => setShowModal(false)}
      title="Track Unmute Request"
      body={`${peer?.name} requested to unmute your tracks`}
      footer={
        <div className="flex space-x-1">
          <Button
            onClick={() => {
              tracks.forEach(track => {
                hmsActions.setEnabledTrack(track.id, enabled);
              });
            }}
          >
            Accept
          </Button>
        </div>
      }
    />
  );
};
