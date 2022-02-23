import { useCallback, useRef } from "react";
import {
  useHMSActions,
  useHMSStore,
  // useHMSNotifications,
  selectIsLocalAudioPluginPresent,
  selectIsAllowedToPublish,
  // selectLocalAudioTrackID,
} from "@100mslive/react-sdk";
import { AudioLevelIcon } from "@100mslive/react-icons";
import { IconButton, Tooltip } from "@100mslive/react-ui";
import { HMSNoiseSuppressionPlugin } from "@100mslive/hms-noise-suppression";

export const NoiseSuppression = () => {
  const pluginRef = useRef(null);
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const hmsActions = useHMSActions();
  const isPluginPresent = useHMSStore(
    selectIsLocalAudioPluginPresent("@100mslive/hms-noise-suppression")
  );

  /* const localAudioTrackID = useHMSStore(selectLocalAudioTrackID);
  const notification = useHMSNotifications();*/

  const createPlugin = () => {
    if (!pluginRef.current) {
      pluginRef.current = new HMSNoiseSuppressionPlugin();
    }
  };

  const addPlugin = useCallback(async () => {
    try {
      createPlugin();
      await hmsActions.addPluginToAudioTrack(pluginRef.current);
    } catch (err) {
      console.error("adding noise suppression plugin failed", err);
    }
  }, [hmsActions]);

  //Commenting by default NS add since its causing audio issues
  /*useEffect(() => {
    if (
      !notification ||
      notification.type !== HMSNotificationTypes.TRACK_ADDED ||
      notification.data?.id !== localAudioTrackID
    ) {
      return;
    }
    if (process.env.REACT_APP_ENV === "qa") {
      addPlugin();
    } else {
      createPlugin();
    }
  }, [addPlugin, notification, localAudioTrackID]);*/

  async function removePlugin() {
    if (pluginRef.current) {
      await hmsActions.removePluginFromAudioTrack(pluginRef.current);
      pluginRef.current = null;
    }
  }

  if (
    !isAllowedToPublish.audio ||
    (pluginRef.current && !pluginRef.current.isSupported())
  ) {
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
        css={{ mx: "$4" }}
      >
        <AudioLevelIcon />
      </IconButton>
    </Tooltip>
  );
};
