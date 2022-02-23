import { useState, useEffect } from "react";
import { HMSNotificationTypes, useHMSActions } from "@100mslive/react-sdk";
import { Button, Dialog, Text } from "@100mslive/react-ui";
import { DialogContent, DialogRow } from "../../new/DialogContent";

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
    <Dialog.Root defaultOpen>
      <DialogContent title="Track Unmute Request">
        <DialogRow>
          <Text variant="md">
            {peer?.name} requested to unmute your {track?.source}
            {track?.type}
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
