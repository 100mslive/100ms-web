import React, { useState, useEffect } from "react";
import { useHMSActions } from "@100mslive/react-sdk";
import { Dialog, Text, Button } from "@100mslive/react-ui";
import { DialogContent, DialogRow } from "../../new/DialogContent";

export function AutoplayBlockedModal({ notification }) {
  const hmsActions = useHMSActions();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (notification?.data?.code === 3008) {
      setShowModal(true);
    }
  }, [notification]);

  return (
    <Dialog.Root
      open={showModal}
      onOpenChange={value => {
        if (!value) {
          hmsActions.unblockAudio();
        }
        setShowModal(value);
      }}
    >
      <DialogContent title="Autoplay Error">
        <DialogRow>
          <Text size="md">
            Autoplay blocked by browser, click on unblock for audio to work
          </Text>
        </DialogRow>
        <DialogRow justify="end">
          <Button
            variant="primary"
            onClick={async () => {
              setShowModal(false);
              await hmsActions.unblockAudio();
            }}
          >
            Accept
          </Button>
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
}
