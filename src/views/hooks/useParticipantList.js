import {
  selectIsConnectedToRoom,
  selectPeerCount,
  selectPeers,
  selectRemotePeers,
  useHMSStore,
} from "@100mslive/react-sdk";
import { useMemo } from "react";
import { groupByRoles } from "../../common/utils";

export const useParticipantList = () => {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const participantList = useHMSStore(
    isConnected ? selectPeers : selectRemotePeers
  );
  const peerCount = useHMSStore(selectPeerCount);
  const participantsByRoles = useMemo(
    () => groupByRoles(participantList),
    [participantList]
  );
  const roles = Object.keys(participantsByRoles);
  return { roles, participantsByRoles, peerCount, isConnected };
};
