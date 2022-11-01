import React from "react";
import { useAutoplayError } from "@100mslive/react-sdk";
import { Button, Dialog, Text } from "@100mslive/react-ui";
import { DialogContent, DialogRow } from "../../primitives/DialogContent";

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
      <DialogContent title="Autoplay Error" closeable={false}>
        <DialogRow>
          <Text variant="md">
            The browser wants us to get a confirmation for playing the Audio.
            Please allow audio to proceed.
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
            Allow Audio
          </Button>
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
}
