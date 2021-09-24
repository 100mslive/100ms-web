import { useEffect } from "react";
import { useHMSActions, useHMSStore } from "@100mslive/hms-video-react";

export function FeatureFlags() {
  const hmsActions = useHMSActions();
  const store = useHMSStore(store => store);
  useEffect(() => {
    // This object will be used for feature flags and storing actions, store globally
    if (!window.HMS) {
      window.HMS = {};
    }
    window.HMS.JOIN_DELAY_FIX = true;
    window.HMS.actions = hmsActions;
    window.HMS.store = store;
  }, [hmsActions, store]);

  return null;
}
