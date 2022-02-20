// @ts-check
import { useContext } from "react";
import { AppContext } from "../../store/AppContext";
import { provider } from "./useCommunication";
import { useWhiteboardMetadata } from "./useWhiteboardMetadata";

export const useRoom = () => {
  const { amIWhiteboardOwner } = useWhiteboardMetadata();
  const { didIJoinRecently } = useContext(AppContext);

  return {
    subscribe: provider.subscribe,
    broadcastEvent: provider.broadcastEvent,
    getStoredState: provider.getStoredEvent,
    storeEvent: provider.storeEvent,
    shouldRequestState: didIJoinRecently,
    amIWhiteboardOwner,
  };
};
