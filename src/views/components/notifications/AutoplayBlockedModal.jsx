import React from "react";
import { useAutoplayError } from "@100mslive/react-sdk";
import { Dialog, Text, Button } from "@100mslive/react-ui";
import { DialogContent, DialogRow } from "../../new/DialogContent";

export function AutoplayBlockedModal() {
  const { error, resetError, unblockAudio } = useAutoplayError();
  return (
    <Dialog.Root
      open={!!error}
      onOpenChange={value => {
        if (!value) {
          unblockAudio();
        }
        resetError();
      }}
    >
      <DialogContent title="Autoplay Error">
        <DialogRow>
          <Text variant="md">
            Autoplay blocked by browser, click on unblock for audio to work
          </Text>
        </DialogRow>
        <DialogRow justify="end">
          <Button
            variant="primary"
            onClick={() => {
              unblockAudio();
              resetError();
            }}
          >
            Accept
          </Button>
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
}
