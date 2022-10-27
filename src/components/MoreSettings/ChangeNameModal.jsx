import React, { useState } from "react";
import {
  selectLocalPeerName,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Box, Button, Dialog, Flex, Input, Text } from "@100mslive/react-ui";
import { ToastManager } from "../Toast/ToastManager";
import {
  UserPreferencesKeys,
  useUserPreferences,
} from "../hooks/useUserPreferences";

export const ChangeNameModal = ({ onOpenChange }) => {
  const [previewPreference, setPreviewPreference] = useUserPreferences(
    UserPreferencesKeys.PREVIEW
  );
  const hmsActions = useHMSActions();
  const localPeerName = useHMSStore(selectLocalPeerName);
  const [currentName, setCurrentName] = useState(localPeerName);

  const changeName = async () => {
    const name = currentName.trim();
    if (!name || name === localPeerName) {
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
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content css={{ width: "min(400px,80%)", p: "$10" }}>
          <Dialog.Title css={{ p: "0 $4" }}>
            <Text variant="h6"> Change Name</Text>
          </Dialog.Title>
          <form
            onSubmit={async e => {
              e.preventDefault();
              await changeName();
            }}
          >
            <Flex justify="center" align="center" css={{ my: "$8", w: "100%" }}>
              <Input
                css={{ width: "100%" }}
                value={currentName}
                onChange={e => {
                  setCurrentName(e.target.value);
                }}
                autoComplete="name"
                required
                data-testid="change_name_field"
              />
            </Flex>

            <Flex
              justify="between"
              align="center"
              css={{
                width: "100%",
                gap: "$md",
                mt: "$10",
              }}
            >
              <Box css={{ w: "50%" }}>
                <Dialog.Close css={{ w: "100%" }}>
                  <Button
                    variant="standard"
                    css={{ w: "100%" }}
                    outlined
                    type="submit"
                    disabled={!localPeerName}
                  >
                    Cancel
                  </Button>
                </Dialog.Close>
              </Box>
              <Box css={{ w: "50%" }}>
                <Button
                  variant="primary"
                  css={{ width: "100%" }}
                  type="submit"
                  disabled={
                    !currentName.trim() || currentName.trim() === localPeerName
                  }
                  data-testid="popup_change_btn"
                >
                  Change
                </Button>
              </Box>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
