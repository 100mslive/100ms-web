// @ts-check
import { useEffect, useRef, useState } from "react";
import {
  selectAvailableRoleNames,
  selectIsConnectedToRoom,
  selectPeerCount,
  useHMSStore,
} from "@100mslive/react-sdk";
import { isInternalRole } from "./utils";

/**
 * Hook to execute a callback when alone in room(after a certain 5d of time)
 * @param {number} thresholdMs The threshold(in ms) after which the callback is executed,
 * starting from the instant when alone in room.
 * note: the cb is not called when another peer joins during this period.
 */
export const useWhenAloneInRoom = (thresholdMs = 5 * 60 * 1000) => {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const peerCount = useHMSStore(selectPeerCount);
  const [aloneForLong, setAloneForLong] = useState(false);
  const cbTimeout = useRef(null);
  const alone = isConnected && peerCount === 1;

  useEffect(() => {
    if (alone && !cbTimeout.current) {
      // @ts-ignore
      cbTimeout.current = setTimeout(() => {
        setAloneForLong(true);
      }, thresholdMs);
    } else if (!alone) {
      cbTimeout.current && clearTimeout(cbTimeout.current);
      cbTimeout.current = null;
      setAloneForLong(false);
    }
  }, [alone, thresholdMs]);

  useEffect(() => {
    return () => {
      if (cbTimeout.current) {
        clearTimeout(cbTimeout.current);
      }
    };
  }, []);

  return { alone, aloneForLong };
};

export const useFilteredRoles = () => {
  const roles = useHMSStore(selectAvailableRoleNames).filter(
    role => !isInternalRole(role)
  );
  return roles;
};
