import {
  useHMSStore,
  selectLocalPeerID,
  selectPeerByCondition,
} from "@100mslive/react-sdk";
import { useCallback, useEffect, useMemo } from "react";
import { getMetadata } from "../../common/utils";
import { useMyMetadata } from "../../components/hooks/useMetadata";
import { FeatureFlags } from "../../services/FeatureFlags";
import { useCommunication } from "./useCommunication";

const isWhiteboardOwner = peer => {
  return !!getMetadata(peer?.metadata).whiteboardOwner;
};

export const useWhiteboardMetadata = () => {
  const localPeerID = useHMSStore(selectLocalPeerID);
  const { updateMetaData } = useMyMetadata();
  const whiteboardOwner = useHMSStore(selectPeerByCondition(isWhiteboardOwner));
  const amIWhiteboardOwner = useMemo(
    () => localPeerID === whiteboardOwner?.id,
    [localPeerID, whiteboardOwner]
  );
  const provider = useCommunication(Boolean(whiteboardOwner));

  /**
   * @param enabled {boolean}
   */
  const toggleWhiteboard = useCallback(async () => {
    if (!provider) {
      console.error("Cannot start whiteboard - Pusher Key unavailable");
    }
    try {
      if (!whiteboardOwner || amIWhiteboardOwner) {
        await updateMetaData({ whiteboardOwner: !whiteboardOwner });
      } else {
        console.warn(
          "Cannot toggle whiteboard as it was shared by another peer"
        );
      }
    } catch (error) {
      console.error("failed to toggle whiteboard to ", !whiteboardOwner, error);
    }
  }, [provider, whiteboardOwner, updateMetaData, amIWhiteboardOwner]);

  useEffect(() => {
    window.toggleWhiteboard = toggleWhiteboard;
  }, [toggleWhiteboard]);

  return {
    /** is whiteboard enabled for the room */
    whiteboardEnabled: FeatureFlags.enableWhiteboard,
    /** owner of the active whiteboard, can also be used to check if whiteboard is active */
    whiteboardOwner,
    amIWhiteboardOwner,
    toggleWhiteboard,
  };
};
