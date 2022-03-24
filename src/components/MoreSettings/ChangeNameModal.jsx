import React, { useState } from "react";
import {
  useHMSActions,
  useHMSStore,
  selectLocalPeer,
} from "@100mslive/react-sdk";
import { Dialog, Button } from "@100mslive/react-ui";
import {
  DialogContent,
  DialogInput,
  DialogRow,
} from "../../primitives/DialogContent";
import {
  useUserPreferences,
  UserPreferencesKeys,
} from "../hooks/useUserPreferences";
import { TextboxIcon } from "@100mslive/react-icons";
import { ToastManager } from "../Toast/ToastManager";

export const ChangeNameModal = ({ onOpenChange }) => {
  const [previewPreference, setPreviewPreference] = useUserPreferences(
    UserPreferencesKeys.PREVIEW
  );
  const hmsActions = useHMSActions();
  const localPeer = useHMSStore(selectLocalPeer);
  const [currentName, setCurrentName] = useState(localPeer?.name);

  const changeName = async () => {
    const name = currentName.trim();
    if (!name || name === localPeer?.name) {
      return;
    }
    try {
      await hmsActions.changeName(name);
      setPreviewPreference({
        ...(previewPreference || {}),
        name,
      });
    } catch (error) {
      console.error("failed to update name", error);
      ToastManager.addToast({ title: error.message });
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
      <DialogContent title="Change my name" Icon={TextboxIcon}>
        <form
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <DialogInput
            title="Name"
            value={currentName}
            onChange={setCurrentName}
            autoComplete="name"
            required
            data-testid="change_name_field"
          />
          <DialogRow justify="end">
            <Button
              variant="primary"
              type="submit"
              disabled={
                !currentName.trim() || currentName.trim() === localPeer?.name
              }
              onClick={async () => {
                await changeName();
              }}
              data-testid="popup_change_btn"
            >
              Change
            </Button>
          </DialogRow>
        </form>
      </DialogContent>
    </Dialog.Root>
  );
};
