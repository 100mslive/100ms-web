import { useEffect, useRef } from "react";
import { HMSVirtualBackgroundPlugin } from "@100mslive/hms-virtual-background";
import {
  useHMSActions,
  useHMSStore,
  selectIsLocalVideoPluginPresent,
  selectIsAllowedToPublish,
} from "@100mslive/react-sdk";
import { VirtualBackgroundIcon } from "@100mslive/react-icons";
import { IconButton, Tooltip } from "@100mslive/react-ui";
import { getRandomVirtualBackground } from "../common/utils";

export const VirtualBackground = () => {
  const pluginRef = useRef(null);
  const hmsActions = useHMSActions();
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const isVBPresent = useHMSStore(
    selectIsLocalVideoPluginPresent("@100mslive/hms-virtual-background")
  );

  function createPlugin() {
    if (!pluginRef.current) {
      pluginRef.current = new HMSVirtualBackgroundPlugin("none", true);
    }
  }
  useEffect(() => {
    createPlugin();
  }, []);

  async function addPlugin() {
    try {
      createPlugin();
      window.HMS.virtualBackground = pluginRef.current;
      await pluginRef.current.setBackground(getRandomVirtualBackground());
      //Running VB on every alternate frame rate for optimized cpu usage
      await hmsActions.addPluginToVideoTrack(pluginRef.current, 15);
    } catch (err) {
      console.error("add virtual background plugin failed", err);
    }
  }

  async function removePlugin() {
    if (pluginRef.current) {
      await hmsActions.removePluginFromVideoTrack(pluginRef.current);
      pluginRef.current = null;
    }
  }

  if (
    !isAllowedToPublish.video ||
    (pluginRef.current && !pluginRef.current.isSupported())
  ) {
    return null;
  }

  return (
    <Tooltip title={`Turn ${!isVBPresent ? "on" : "off"} virtual background`}>
      <IconButton
        active={!isVBPresent}
        onClick={() => {
          !isVBPresent ? addPlugin() : removePlugin();
        }}
        css={{ mx: "$4" }}
      >
        <VirtualBackgroundIcon />
      </IconButton>
    </Tooltip>
  );
};
