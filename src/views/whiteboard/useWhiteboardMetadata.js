import {
  useHMSStore,
  selectLocalPeerID,
  selectPeerByCondition,
} from "@100mslive/react-sdk";
import { useCallback, useMemo } from "react";
import { useMyMetadata } from "../hooks/useMetadata";
import { useCommunication } from "./useCommunication";

const isWhiteboardOwner = peer =>
  peer?.metadata && peer.metadata !== ""
    ? JSON.parse(peer.metadata).whiteboardOwner
    : false;

export const useWhiteboardMetadata = () => {
  /**
   * Initializes CommunicationProvider even before whiteboard is opened,
   * to store incoming state messages that need to be applied after it has opened.
   */
  const provider = useCommunication();
  const localPeerID = useHMSStore(selectLocalPeerID);
  const { updateMetaData } = useMyMetadata();
  const whiteboardOwner = useHMSStore(selectPeerByCondition(isWhiteboardOwner));
  const amIWhiteboardOwner = useMemo(
    () => localPeerID === whiteboardOwner?.id,
    [localPeerID, whiteboardOwner]
  );

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

  return {
    whiteboardEnabled: !!provider,
    whiteboardOwner,
    amIWhiteboardOwner,
    toggleWhiteboard,
  };
};
