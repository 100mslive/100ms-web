import { useEffect, useRef, useState } from "react";
import {
  selectIsAllowedToPublish,
  selectIsLocalVideoPluginPresent,
  selectLocalVideoTrackID,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { VirtualBackgroundIcon } from "@100mslive/react-icons";
import { Tooltip } from "@100mslive/react-ui";
import IconButton from "../../IconButton";
import { getRandomVirtualBackground } from "./vbutils";

export const VirtualBackground = () => {
  const pluginRef = useRef(null);
  const hmsActions = useHMSActions();
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const [isVBSupported, setIsVBSupported] = useState(false);
  const localPeerVideoTrackID = useHMSStore(selectLocalVideoTrackID);
  const isVBPresent = useHMSStore(
    selectIsLocalVideoPluginPresent("@100mslive/hms-virtual-background")
  );

  async function createPlugin() {
    if (!pluginRef.current) {
      const { HMSVirtualBackgroundPlugin } = await import(
        "@100mslive/hms-virtual-background"
      );
      pluginRef.current = new HMSVirtualBackgroundPlugin("none", true);
    }
  }
  useEffect(() => {
    if (!localPeerVideoTrackID) {
      return;
    }
    createPlugin().then(() => {
      //check support of plugin
      const pluginSupport = hmsActions.validateVideoPluginSupport(
        pluginRef.current
      );
      setIsVBSupported(pluginSupport.isSupported);
    });
  }, [hmsActions, localPeerVideoTrackID]);

  async function addPlugin() {
    try {
      await createPlugin();
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

  if (!isAllowedToPublish.video || !isVBSupported) {
    return null;
  }

  return (
    <Tooltip title={`Turn ${!isVBPresent ? "on" : "off"} virtual background`}>
      <IconButton
        active={!isVBPresent}
        onClick={() => {
          !isVBPresent ? addPlugin() : removePlugin();
        }}
        data-testid="virtual_bg_btn"
      >
        <VirtualBackgroundIcon />
      </IconButton>
    </Tooltip>
  );
};
