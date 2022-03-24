import React from "react";
import { useHMSActions } from "@100mslive/react-sdk";
import { Dialog, Button } from "@100mslive/react-ui";
import { DialogContent, DialogRow } from "../primitives/DialogContent";

export const ScreenShareHintModal = ({ onClose }) => {
  const hmsActions = useHMSActions();
  return (
    <Dialog.Root defaultOpen onOpenChange={value => !value && onClose()}>
      <DialogContent title="AudioOnly Screenshare">
        <img
          src="/share-audio.png"
          alt="AudioOnly Screenshare instructions"
        ></img>
        <DialogRow justify="end">
          <Button
            variant="primary"
            onClick={() => {
              hmsActions.setScreenShareEnabled(true, true);
              onClose();
            }}
            data-testid="audio_screenshare_continue"
          >
            Continue
          </Button>
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
};
