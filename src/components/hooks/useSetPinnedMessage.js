// @ts-check
import { useCallback } from "react";
import {
  selectPeerNameByID,
  selectSessionMetadata,
  useHMSActions,
  useHMSStore,
  useHMSVanillaStore,
} from "@100mslive/react-sdk";
import { ToastManager } from "../Toast/ToastManager";

/**
 * set pinned chat message by updating the session store
 */
export const useSetPinnedMessage = () => {
  const hmsActions = useHMSActions();
  const vanillaStore = useHMSVanillaStore();
  const pinnedMessage = useHMSStore(selectSessionMetadata);

  const setPinnedMessage = useCallback(
    /**
     * @param {import("@100mslive/react-sdk").HMSMessage | undefined} message
     */
    async message => {
      const peerName =
        vanillaStore.getState(selectPeerNameByID(message?.sender)) ||
        message?.senderName;
      const newPinnedMessage = message
        ? peerName
          ? `${peerName}: ${message.message}`
          : message.message
        : null;
      if (newPinnedMessage !== pinnedMessage) {
        await hmsActions.sessionStore
          .set("pinnedMessage", newPinnedMessage)
          .catch(err => ToastManager.addToast({ title: err.description }));
      }
    },
    [hmsActions, vanillaStore, pinnedMessage]
  );

  return { setPinnedMessage };
};
