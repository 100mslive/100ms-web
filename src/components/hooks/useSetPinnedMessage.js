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
import { SESSION_STORE_KEY } from "../../common/constants";

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
          .set(SESSION_STORE_KEY.PINNED_MESSAGE, newPinnedMessage)
          .catch(err => ToastManager.addToast({ title: err.description }));
      }
    },
    [hmsActions, vanillaStore, pinnedMessage]
  );

  return { setPinnedMessage };
};
