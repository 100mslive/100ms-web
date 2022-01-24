import { useEffect, useRef } from "react";
import {
  useHMSActions,
  useHMSStore,
  selectIsLocalAudioPluginPresent,
} from "@100mslive/react-sdk";
import { AudioLevelIcon } from "@100mslive/react-icons";
import { IconButton, Tooltip } from "@100mslive/react-ui";
import { HMSNoiseSuppressionPlugin } from "@100mslive/hms-noise-suppression";

export const NoiseSuppression = () => {
  const pluginRef = useRef(null);
  const hmsActions = useHMSActions();
  const isPluginPresent = useHMSStore(
    selectIsLocalAudioPluginPresent("@100mslive/hms-noise-suppression")
  );

  const createPlugin = () => {
    if (!pluginRef.current) {
      pluginRef.current = new HMSNoiseSuppressionPlugin();
    }
  };

  useEffect(() => {
    createPlugin();
  }, []);

  async function addPlugin() {
    try {
      createPlugin();
      await hmsActions.addPluginToAudioTrack(pluginRef.current);
    } catch (err) {
      console.error("adding noise suppression plugin failed", err);
    }
  }

  async function removePlugin() {
    if (pluginRef.current) {
      await hmsActions.removePluginFromAudioTrack(pluginRef.current);
      pluginRef.current = null;
    }
  }

  if (pluginRef.current && !pluginRef.current.isSupported()) {
    return null;
  }

  return (
    <Tooltip
      title={`Turn ${!isPluginPresent ? "on" : "off"} noise suppression`}
    >
      <IconButton
        active={!isPluginPresent}
        onClick={() => {
          !isPluginPresent ? addPlugin() : removePlugin();
        }}
        css={{ ml: "$2", "@md": { display: "none" } }}
      >
        <AudioLevelIcon />
      </IconButton>
    </Tooltip>
  );
};
