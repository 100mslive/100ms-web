import React, { Fragment, useState } from "react";
import {
  GridIcon,
  HamburgerMenuIcon,
  InfoIcon,
  RecordIcon,
  SettingIcon,
  SpotlightIcon,
  TextboxIcon,
} from "@100mslive/react-icons";
import { selectPermissions, useHMSStore } from "@100mslive/react-sdk";
import { Box, Dropdown, IconButton, Text, Tooltip } from "@100mslive/react-ui";
import { ChangeName, StatsForNerds } from "../../components/ChangeName";
import { ChangeSelfRole } from "./ChangeSelfRole";
import { RecordingAndRTMPModal } from "../../components/RecordingAndRTMPModal";
import { FullScreenItem } from "./FullScreenItem";
import { MuteAll } from "../../components/MuteAll";
import Settings from "../Settings";
import { FeatureFlags } from "../../../store/FeatureFlags";
import { UISettings } from "./UISettings";

const hoverStyles = {
  "&:hover": {
    cursor: "pointer",
    bg: "$iconHoverBg",
  },
  "&:focus-visible": {
    bg: "$iconHoverBg",
  },
};

export const MoreSettings = () => {
  const permissions = useHMSStore(selectPermissions);
  const [open, setOpen] = useState(false);
  const [showChangeNameModal, setShowChangeNameModal] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [showMuteAll, setShowMuteAll] = useState(false);
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);
  const [showStatsForNerds, setShowStatsForNerds] = useState(false);
  const [showUISettings, setShowUISettings] = useState(false);

  return (
    <Fragment>
      <Dropdown.Root open={open} onOpenChange={setOpen}>
        <Dropdown.Trigger asChild>
          <IconButton css={{ mx: "$4" }}>
            <Tooltip title="More Options">
              <Box>
                <HamburgerMenuIcon />
              </Box>
            </Tooltip>
          </IconButton>
        </Dropdown.Trigger>
        <Dropdown.Content
          sideOffset={5}
          align="center"
          css={{ maxHeight: "$96" }}
        >
          <Dropdown.Item
            css={hoverStyles}
            onClick={() => setShowChangeNameModal(value => !value)}
          >
            <TextboxIcon />
            <Text variant="sm" css={{ ml: "$4" }}>
              Change Name
            </Text>
          </Dropdown.Item>
          <ChangeSelfRole css={hoverStyles} />
          {(permissions.streaming || permissions.recording) && (
            <Dropdown.Item
              onClick={() => setShowRecordingModal(true)}
              css={hoverStyles}
            >
              <RecordIcon />
              <Text variant="sm" css={{ ml: "$4" }}>
                Streaming/Recording
              </Text>
            </Dropdown.Item>
          )}
          <FullScreenItem hoverStyles={hoverStyles} />
          {permissions.mute && (
            <Dropdown.Item
              onClick={() => setShowMuteAll(true)}
              css={hoverStyles}
            >
              <SpotlightIcon />
              <Text variant="sm" css={{ ml: "$4" }}>
                Mute All
              </Text>
            </Dropdown.Item>
          )}
          <Dropdown.ItemSeparator />
          <Dropdown.Item
            onClick={() => setShowUISettings(true)}
            css={hoverStyles}
          >
            <GridIcon />
            <Text variant="sm" css={{ ml: "$4" }}>
              UI Settings
            </Text>
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => setShowDeviceSettings(true)}
            css={hoverStyles}
          >
            <SettingIcon />
            <Text variant="sm" css={{ ml: "$4" }}>
              Device Settings
            </Text>
          </Dropdown.Item>
          {FeatureFlags.enableStatsForNerds && (
            <Dropdown.Item
              onClick={() => setShowStatsForNerds(true)}
              css={hoverStyles}
            >
              <InfoIcon />
              <Text variant="sm" css={{ ml: "$4" }}>
                Stats for Nerds
              </Text>
            </Dropdown.Item>
          )}
        </Dropdown.Content>
      </Dropdown.Root>
      <MuteAll
        showModal={showMuteAll}
        onCloseModal={() => setShowMuteAll(false)}
      />
      <ChangeName
        show={showChangeNameModal}
        onToggle={value => setShowChangeNameModal(value)}
      />
      <RecordingAndRTMPModal
        show={showRecordingModal}
        onToggle={value => setShowRecordingModal(value)}
      />
      <Settings
        open={showDeviceSettings}
        onOpenChange={setShowDeviceSettings}
      />
      {FeatureFlags.enableStatsForNerds && (
        <StatsForNerds
          showModal={showStatsForNerds}
          onCloseModal={() => setShowStatsForNerds(false)}
        />
      )}
      <UISettings
        show={showUISettings}
        onToggle={value => setShowUISettings(value)}
      />
    </Fragment>
  );
};
