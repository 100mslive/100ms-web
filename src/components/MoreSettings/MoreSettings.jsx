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
          <ChangeSelfRole
            css={hoverStyles}
            onClick={() => setShowSelfRoleChange(true)}
          />
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
