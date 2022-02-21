// @ts-check
import { useHMSStore, selectDidIJoinWithin } from "@100mslive/react-sdk";
import { provider } from "./useCommunication";
import { useWhiteboardMetadata } from "./useWhiteboardMetadata";

export const useRoom = () => {
  const { amIWhiteboardOwner } = useWhiteboardMetadata();
  const shouldRequestState = useHMSStore(selectDidIJoinWithin(500));

  return {
    subscribe: provider.subscribe,
    broadcastEvent: provider.broadcastEvent,
    getStoredState: provider.getStoredEvent,
    storeEvent: provider.storeEvent,
    shouldRequestState,
    amIWhiteboardOwner,
  };
};
