import { useState, useEffect } from "react";
import {
  HMSNotificationTypes,
  useHMSActions,
  useHMSNotifications,
} from "@100mslive/react-sdk";
import { Dialog, Text, Button } from "@100mslive/react-ui";
import { DialogContent, DialogRow } from "../../new/DialogContent";

export const TrackMuteAllModal = () => {
  const hmsActions = useHMSActions();
  const [muteNotification, setMuteNotification] = useState(null);
  const notification = useHMSNotifications(
    HMSNotificationTypes.CHANGE_MULTI_TRACK_STATE_REQUEST
  );

  useEffect(() => {
    if (notification?.data.enabled) {
      setMuteNotification(notification.data);
    }
  }, [notification]);

  if (!muteNotification) {
    return null;
  }

  const { requestedBy: peer, tracks, enabled } = muteNotification;

  return (
    <Dialog.Root defaultOpen>
      <DialogContent title="Track Unmute Request">
        <DialogRow>
          <Text size="md">{peer?.name} requested to unmute your tracks</Text>
        </DialogRow>
        <DialogRow justify="end">
          <Button
            variant="primary"
            onClick={() => {
              tracks.forEach(track => {
                hmsActions.setEnabledTrack(track.id, enabled);
              });
              setMuteNotification(null);
            }}
          >
            Accept
          </Button>
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
};
