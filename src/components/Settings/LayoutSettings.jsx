import React, { Fragment, useCallback } from "react";
import { Flex, Slider, Text } from "@100mslive/react-ui";
import {
  selectIsLocalScreenShared,
  selectIsLocalVideoEnabled,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import SwitchWithLabel from "./SwitchWithLabel";
import { useSetUiSettings } from "../AppData/useUISettings";
import {
  UI_MODE_ACTIVE_SPEAKER,
  UI_MODE_GRID,
  UI_SETTINGS,
} from "../../common/constants";

export const LayoutSettings = () => {
  const hmsActions = useHMSActions();
  const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);
  const isLocalScreenShared = useHMSStore(selectIsLocalScreenShared);
  const [{ isAudioOnly, uiViewMode, maxTileCount }, setUISettings] =
    useSetUiSettings();
  const toggleIsAudioOnly = useCallback(
    async isAudioOnlyModeOn => {
      if (isAudioOnlyModeOn) {
        // turn off video and screen share if user switches to audio only mode
        isLocalVideoEnabled && (await hmsActions.setLocalVideoEnabled(false));
        isLocalScreenShared && (await hmsActions.setScreenShareEnabled(false));
      }
      setUISettings({ [UI_SETTINGS.isAudioOnly]: isAudioOnlyModeOn });
    },
    [hmsActions, isLocalVideoEnabled, isLocalScreenShared, setUISettings]
  );

  return (
    <Fragment>
      <SwitchWithLabel
        checked={uiViewMode === UI_MODE_ACTIVE_SPEAKER}
        onChange={value => {
          setUISettings({
            [UI_SETTINGS.uiViewMode]: value
              ? UI_MODE_ACTIVE_SPEAKER
              : UI_MODE_GRID,
          });
        }}
        id="activeSpeakerMode"
        label="Active Speaker Mode"
      />
      <SwitchWithLabel
        label="Audio Only Mode"
        id="audioOnlyMode"
        checked={isAudioOnly}
        onChange={toggleIsAudioOnly}
      />
      <Flex
        align="center"
        css={{ w: "100%", my: "$2", py: "$8", "@md": { display: "none" } }}
      >
        <Text variant="md" css={{ fontWeight: "$semiBold" }}>
          Tiles In View({maxTileCount})
        </Text>
        <Flex justify="end" css={{ flex: "1 1 0" }}>
          <Slider
            step={1}
            value={[maxTileCount]}
            min={1}
            max={49}
            onValueChange={e => {
              setUISettings({ [UI_SETTINGS.maxTileCount]: e[0] });
            }}
            css={{ w: "70%" }}
          />
        </Flex>
      </Flex>
    </Fragment>
  );
};
