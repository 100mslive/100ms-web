import { useCustomEvent, useHMSActions } from "@100mslive/react-sdk";
import { useCallback } from "react";

export const REFRESH_MESSAGE = "refresh";
export const METADATA_MESSAGE_TYPE = "metadata";

/**
 * Refesh(re-populate) session metadata on receiving refesh broadcast message of type metadata
 */
export const useRefreshSessionMetadata = () => {
  const hmsActions = useHMSActions();

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
