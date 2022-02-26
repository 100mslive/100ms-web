import { useState, useEffect } from "react";
import {
  HMSNotificationTypes,
  useHMSActions,
  useHMSNotifications,
} from "@100mslive/react-sdk";
import { Button, Dialog, Text } from "@100mslive/react-ui";
import { DialogContent, DialogRow } from "../../new/DialogContent";

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
    <Dialog.Root defaultOpen>
      <DialogContent title="Track Unmute Request">
        <DialogRow>
          <Text size="md">
            {peer?.name} requested to unmute your {track?.source} {track?.type}
          </Text>
        </DialogRow>
        <DialogRow justify="end">
          <Button
            variant="primary"
            onClick={() => {
              hmsActions.setEnabledTrack(track.id, enabled);
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
