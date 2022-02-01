// @ts-check
import {
  useHMSActions,
  useHMSStore,
  selectPeerCount,
  selectPermissions,
} from "@100mslive/react-sdk";
import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../store/AppContext";

/**
 * Hook to execute a callback when alone in room(after a certain 5d of time)
 * @param {Function} cb The callback to execute
 * @param {number} thresholdMs The threshold(in ms) after which the callback is executed,
 * starting from the instant when alone in room.
 * note: the cb is not called when another peer joins during this period.
 */
const useWhenAloneInRoom = (cb, thresholdMs = 5 * 60 * 1000) => {
  const peerCount = useHMSStore(selectPeerCount);
  const cbTimeout = useRef(null);
  const alone = peerCount === 1;

  useEffect(() => {
    if (alone) {
      cbTimeout.current = setTimeout(cb, thresholdMs);
    } else {
      cbTimeout.current && clearTimeout(cbTimeout.current);
      cbTimeout.current = null;
    }
  }, [alone, cb, thresholdMs]);
};

export const useBeamAutoLeave = () => {
  const hmsActions = useHMSActions();
  const permissions = useHMSStore(selectPermissions);
  const {
    loginInfo: { isHeadless },
  } = useContext(AppContext);
  useWhenAloneInRoom(() => {
    if (isHeadless && permissions.endRoom) {
      /**
       * End room after 5 minutes of being alone in the room to stop beam
       * Note: Leave doesn't stop beam
       */
      hmsActions.endRoom(false, "Stop Beam");
    }
  });
};
