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
      const senderId = message?.sender;
      const peerName =
        vanillaStore.getState(selectPeerNameByID(senderId)) ||
        message?.senderName;

      const messageContent = message ? message.message : null;
      const newPinnedMessage = peerName
        ? `${peerName}: ${messageContent}`
        : messageContent;

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
