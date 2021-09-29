import { useState, useEffect } from "react";
import {
  Button,
  MessageModal,
  useHMSActions,
} from "@100mslive/hms-video-react";

export function AutoplayBlockedModal(notification) {
  const hmsActions = useHMSActions();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (notification?.data?.code === 3008) {
      setShowModal(true);
    }
  }, [notification]);

  if (!notification || !notification.data) {
    return null;
  }

  return (
    <MessageModal
      show={showModal}
      onClose={async () => {
        await hmsActions.unblockAudio();
        setShowModal(false);
      }}
      title="Autoplay blocked"
      body="Autoplay blocked by browser please click on unblock for audio to work"
      footer={
        <div className="flex space-x-1">
          <Button
            onClick={async () => await hmsActions.unblockAudio()}
            variant="emphasized"
          >
            Unblock
          </Button>
        </div>
      }
    />
  );
}
