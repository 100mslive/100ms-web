import { useCallback } from "react";
import {
  selectPeerNameByID,
  selectSessionMetadata,
  useCustomEvent,
  useHMSActions,
  useHMSStore,
  useHMSVanillaStore,
} from "@100mslive/react-sdk";

const REFRESH_MESSAGE = "refresh";

export const useSetPinnedMessage = () => {
  const hmsActions = useHMSActions();
  const vanillaStore = useHMSVanillaStore();
  const pinnedMessage = useHMSStore(selectSessionMetadata);

  const { sendEvent } = useCustomEvent({
    type: "metadata",
    onEvent: message => {
      if (message === REFRESH_MESSAGE) {
        hmsActions.populateSessionMetadata();
      }
    },
  });

  const setPinnedMessage = useCallback(
    /**
     * @param {import("@100mslive/react-sdk").HMSMessage} message
     */
    async message => {
      const peerName = vanillaStore.getState(
        selectPeerNameByID(message.sender)
      );
      const newPinnedMessage = `${peerName}: ${message.message}`;
      if (newPinnedMessage !== pinnedMessage) {
        await hmsActions.setSessionMetadata(newPinnedMessage);
        sendEvent(REFRESH_MESSAGE);
      }
    },
    [hmsActions, vanillaStore, pinnedMessage, sendEvent]
  );

  return { setPinnedMessage };
};
