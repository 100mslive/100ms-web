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
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    setShowModal(
      Boolean(
        notification &&
          notification.type ===
            HMSNotificationTypes.CHANGE_TRACK_STATE_REQUEST &&
          notification.data?.enabled
      )
    );
  }, [notification]);
  if (notification && notification.data) {
    const { requestedBy: peer, track, enabled } = notification.data;

    return (
      <MessageModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Track Unmute Request"
        body={`${peer?.name} requested to unmute your ${track?.source} ${track?.type}`}
        footer={
          <div className="flex space-x-1">
            <Button
              onClick={() => hmsActions.setEnabledTrack(track.id, enabled)}
            >
              Accept
            </Button>
          </div>
        }
      />
    );
  } else {
    return null;
  }
};
