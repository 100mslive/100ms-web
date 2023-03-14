import { useEffect } from "react";
import { useHMSActions } from "@100mslive/react-sdk";
import { useIsHeadless } from "../AppData/useUISettings";
import { FeatureFlags } from "../../services/FeatureFlags";

export function BeamSpeakerLabelsLogging() {
  const hmsActions = useHMSActions();
  const isHeadless = useIsHeadless();

  useEffect(() => {
    if (FeatureFlags.enableBeamSpeakersLogging && isHeadless) {
      hmsActions.enableBeamSpeakerLabelsLogging();
    }
  }, [hmsActions, isHeadless]);
  return null;
}
