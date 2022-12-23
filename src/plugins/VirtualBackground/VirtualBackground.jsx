import { useEffect, useRef, useState } from "react";
import { HMSVirtualBackgroundTypes } from "@100mslive/hms-virtual-background";
import {
  selectIsAllowedToPublish,
  selectIsLocalVideoPluginPresent,
  selectLocalPeerRole,
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
  const role = useHMSStore(selectLocalPeerRole);
  const [isVBSupported, setIsVBSupported] = useState(false);
  const localPeerVideoTrackID = useHMSStore(selectLocalVideoTrackID);
  const isVBPresent = useHMSStore(selectIsLocalVideoPluginPresent("HMSVB"));

  async function createPlugin() {
    if (!pluginRef.current) {
      const { HMSVBPlugin } = await import("@100mslive/hms-virtual-background");
      pluginRef.current = new HMSVBPlugin(
        HMSVirtualBackgroundTypes.NONE,
        HMSVirtualBackgroundTypes.NONE
      );
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
      const { background, backgroundType } = getRandomVirtualBackground();
      await pluginRef.current.setBackground(background, backgroundType);
      await hmsActions.addPluginToVideoTrack(
        pluginRef.current,
        Math.floor(role.publishParams.video.frameRate / 2)
      );
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
