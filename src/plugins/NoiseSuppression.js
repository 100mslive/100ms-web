import { useCallback, useEffect, useRef, useState } from "react";
import {
  selectIsLocalAudioPluginPresent,
  useDevices,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { AudioLevelIcon } from "@100mslive/react-icons";
import { Tooltip } from "@100mslive/react-ui";
import { ToastManager } from "../components/Toast/ToastManager";
import IconButton from "../IconButton";
import { FeatureFlags } from "../services/FeatureFlags";

export const NoiseSuppression = () => {
  const pluginRef = useRef(null);
  const hmsActions = useHMSActions();
  const [disable, setDisabled] = useState(false);
  const [isNSSupported, setIsNSSupported] = useState(false);
  const isPluginPresent = useHMSStore(
    selectIsLocalAudioPluginPresent("@100mslive/hms-noise-suppression")
  );
  const { selectedDeviceIDs } = useDevices();
  const pluginActive = isPluginPresent && !disable;

  const createPlugin = useCallback(async () => {
    if (!pluginRef.current) {
      const { HMSNoiseSuppressionPlugin } = await import(
        "@100mslive/hms-noise-suppression"
      );
      pluginRef.current = new HMSNoiseSuppressionPlugin(
        process.env.NS_DURATION_TIME_IN_MS
      );
    }
  }, []);

  const removePlugin = useCallback(async () => {
    if (pluginRef.current) {
      await hmsActions.removePluginFromAudioTrack(pluginRef.current);
      pluginRef.current = null;
    }
  }, [hmsActions]);

  const handleFailure = useCallback(
    async err => {
      let message = "adding Noise Suppression plugin failed, see docs";
      if (err.message) {
        message = err.message;
      }
      ToastManager.addToast({
        title: message,
      });

      setDisabled(true);
      await removePlugin();
      pluginRef.current = null;
      console.error(err);
    },
    [removePlugin]
  );

  const addPlugin = useCallback(async () => {
    try {
      setDisabled(false);
      await createPlugin();
      //check support its recommended
      const pluginSupport = hmsActions.validateAudioPluginSupport(
        pluginRef.current
      );
      if (pluginSupport.isSupported) {
        await hmsActions.addPluginToAudioTrack(pluginRef.current);
      } else {
        const err = pluginSupport.errMsg;
        await handleFailure(err);
      }
    } catch (err) {
      await handleFailure(err);
    }
  }, [hmsActions, handleFailure, createPlugin]);

  useEffect(() => {
    (async () => {
      if (!pluginRef.current) {
        await createPlugin();
      }

      const pluginSupport = hmsActions.validateAudioPluginSupport(
        pluginRef.current
      );
      setIsNSSupported(pluginSupport.isSupported);
      setDisabled(!pluginSupport.isSupported);
    })();
  }, [selectedDeviceIDs.audioInput, hmsActions, createPlugin]);

  if (isNSSupported && FeatureFlags.showNS()) {
    return (
      <Tooltip title={`Turn ${pluginActive ? "off" : "on"} noise suppression`}>
        <IconButton
          active={!pluginActive}
          disabled={disable}
          onClick={async () => {
            if (pluginActive) {
              await removePlugin();
            } else {
              await addPlugin();
            }
          }}
          data-testid="noise_suppression_btn"
        >
          <AudioLevelIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return null;
};
