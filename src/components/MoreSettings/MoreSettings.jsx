import React, { Fragment, useState } from "react";
import {
  GridIcon,
  HamburgerMenuIcon,
  InfoIcon,
  MicOffIcon,
  RecordIcon,
  SettingIcon,
  TextboxIcon,
} from "@100mslive/react-icons";
import {
  selectLocalPeerID,
  selectPermissions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Box, Dropdown, IconButton, Text, Tooltip } from "@100mslive/react-ui";
import { ChangeSelfRole } from "./ChangeSelfRole";
import { FullScreenItem } from "./FullScreenItem";
import { UISettings } from "./UISettings";
import Settings from "../Settings";
import { RoleChangeModal } from "../RoleChangeModal";
import { ChangeNameModal } from "./ChangeNameModal";
import { StatsForNerds } from "../StatsForNerds";
import { MuteAllModal } from "./MuteAllModal";
import { RecordingAndRTMPModal } from "./RecordingAndRTMPModal";
import { FeatureFlags } from "../../services/FeatureFlags";

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
  const localPeerId = useHMSStore(selectLocalPeerID);
  const [open, setOpen] = useState(false);
  const [showChangeNameModal, setShowChangeNameModal] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [showMuteAll, setShowMuteAll] = useState(false);
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);
  const [showStatsForNerds, setShowStatsForNerds] = useState(false);
  const [showUISettings, setShowUISettings] = useState(false);
  const [showSelfRoleChange, setShowSelfRoleChange] = useState(false);

  return (
    <Fragment>
      <Dropdown.Root open={open} onOpenChange={setOpen}>
        <Dropdown.Trigger asChild data-testid="more_settings_btn">
          <IconButton
            css={{
              mx: "$4",
            }}
          >
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
            data-testid="change_name_btn"
          >
            <TextboxIcon />
            <Text variant="sm" css={{ ml: "$4" }}>
              Change Name
            </Text>
          </Dropdown.Item>
          <ChangeSelfRole
            css={hoverStyles}
            onClick={() => setShowSelfRoleChange(true)}
          />
          {(permissions.streaming || permissions.recording) && (
            <Dropdown.Item
              onClick={() => setShowRecordingModal(true)}
              css={hoverStyles}
              data-testid="streaming_recording_btn"
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
              data-testid="mute_all_btn"
            >
              <MicOffIcon />
              <Text variant="sm" css={{ ml: "$4" }}>
                Mute All
              </Text>
            </Dropdown.Item>
          )}
          <Dropdown.ItemSeparator />
          <Dropdown.Item
            onClick={() => setShowUISettings(true)}
            css={hoverStyles}
            data-testid="ui_settings_btn"
          >
            <GridIcon />
            <Text variant="sm" css={{ ml: "$4" }}>
              UI Settings
            </Text>
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => setShowDeviceSettings(true)}
            css={hoverStyles}
            data-testid="device_settings_btn"
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
              data-testid="stats_for_nreds_btn"
            >
              <InfoIcon />
              <Text variant="sm" css={{ ml: "$4" }}>
                Stats for Nerds
              </Text>
            </Dropdown.Item>
          )}
        </Dropdown.Content>
      </Dropdown.Root>
      {showMuteAll && <MuteAllModal onOpenChange={setShowMuteAll} />}
      {showChangeNameModal && (
        <ChangeNameModal onOpenChange={setShowChangeNameModal} />
      )}
      {showRecordingModal && (
        <RecordingAndRTMPModal onOpenChange={setShowRecordingModal} />
      )}
      {showDeviceSettings && (
        <Settings open onOpenChange={setShowDeviceSettings} />
      )}
      {FeatureFlags.enableStatsForNerds && showStatsForNerds && (
        <StatsForNerds
          open={showStatsForNerds}
          onOpenChange={setShowStatsForNerds}
        />
      )}
      {showUISettings && (
        <UISettings open={showUISettings} onOpenChange={setShowUISettings} />
      )}
      {showSelfRoleChange && (
        <RoleChangeModal
          peerId={localPeerId}
          onOpenChange={setShowSelfRoleChange}
        />
      )}
    </Fragment>
  );
};
