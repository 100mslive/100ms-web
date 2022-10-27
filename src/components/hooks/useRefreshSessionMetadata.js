import { useCallback, useEffect } from "react";
import {
  selectIsConnectedToRoom,
  useCustomEvent,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";

export const REFRESH_MESSAGE = "refresh";
export const METADATA_MESSAGE_TYPE = "metadata";

/**
 * Refresh(re-populate) session metadata on receiving refresh broadcast message of type metadata
 */
export const useRefreshSessionMetadata = () => {
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);

  useEffect(() => {
    if (isConnected) {
      hmsActions.populateSessionMetadata();
    }
  }, [hmsActions, isConnected]);

  const onEvent = useCallback(
    message => {
      if (message === REFRESH_MESSAGE) {
        hmsActions.populateSessionMetadata();
      }
    },
    [hmsActions]
  );

  useCustomEvent({
    type: METADATA_MESSAGE_TYPE,
    json: false,
    onEvent,
  });
};
