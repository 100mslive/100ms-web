import React, { Fragment, useState } from "react";
import { useMedia } from "react-use";
import Hls from "hls.js";
import {
  selectAppData,
  selectIsAllowedToPublish,
  selectLocalPeerID,
  selectLocalPeerRoleName,
  selectPermissions,
  useHMSActions,
  useHMSStore,
  useRecordingStreaming,
} from "@100mslive/react-sdk";
import {
  ChangeRoleIcon,
  CheckIcon,
  InfoIcon,
  MicOffIcon,
  PencilIcon,
  RecordIcon,
  SettingsIcon,
  VerticalMenuIcon,
} from "@100mslive/react-icons";
import {
  Box,
  Checkbox,
  config as cssConfig,
  Dropdown,
  Flex,
  Text,
  Tooltip,
} from "@100mslive/react-ui";
import IconButton from "../../IconButton";
import { RoleChangeModal } from "../RoleChangeModal";
import SettingsModal from "../Settings/SettingsModal";
import StartRecording from "../Settings/StartRecording";
import { StatsForNerds } from "../StatsForNerds";
import { BulkRoleChangeModal } from "./BulkRoleChangeModal";
import { ChangeNameModal } from "./ChangeNameModal";
import { ChangeSelfRole } from "./ChangeSelfRole";
import { EmbedUrl, EmbedUrlModal } from "./EmbedUrl";
import { FullScreenItem } from "./FullScreenItem";
import { MuteAllModal } from "./MuteAllModal";
import { FeatureFlags } from "../../services/FeatureFlags";
import { APP_DATA, isAndroid, isIOS, isMacOS } from "../../common/constants";

const isMobileOS = isAndroid || isIOS;

export const MoreSettings = () => {
  const permissions = useHMSStore(selectPermissions);
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const localPeerId = useHMSStore(selectLocalPeerID);
  const localPeerRole = useHMSStore(selectLocalPeerRoleName);
  const hmsActions = useHMSActions();
  const enablHlsStats = useHMSStore(selectAppData(APP_DATA.hlsStats));
  const [open, setOpen] = useState(false);
  const [showChangeNameModal, setShowChangeNameModal] = useState(false);
  const [showMuteAll, setShowMuteAll] = useState(false);
  const [showOpenUrl, setShowOpenUrl] = useState(false);
  const [showBulkRoleChange, setShowBulkRoleChange] = useState(false);
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);
  const [showStatsForNerds, setShowStatsForNerds] = useState(false);
  const [showSelfRoleChange, setShowSelfRoleChange] = useState(false);
  const [showStartRecording, setShowStartRecording] = useState(false);
  const isMobile = useMedia(cssConfig.media.md);
  const { isBrowserRecordingOn } = useRecordingStreaming();
  return (
    <Fragment>
      <Dropdown.Root open={open} onOpenChange={setOpen}>
        <Dropdown.Trigger asChild data-testid="more_settings_btn">
          <IconButton>
            <Tooltip title="More options">
              <Box>
                <VerticalMenuIcon />
              </Box>
            </Tooltip>
          </IconButton>
        </Dropdown.Trigger>

        <Dropdown.Content
          sideOffset={5}
          align="center"
          css={{ maxHeight: "$96", "@md": { w: "$64" } }}
        >
          {isMobile && permissions?.browserRecording ? (
            <>
              <Dropdown.Item
                onClick={() => setShowStartRecording(value => !value)}
              >
                <RecordIcon />
                <Text variant="sm" css={{ ml: "$4" }}>
                  {isBrowserRecordingOn ? "Stop" : "Start"} Recording
                </Text>
              </Dropdown.Item>
              <Dropdown.ItemSeparator />
            </>
          ) : null}
          <Dropdown.Item
            onClick={() => setShowChangeNameModal(value => !value)}
            data-testid="change_name_btn"
          >
            <PencilIcon />
            <Text variant="sm" css={{ ml: "$4" }}>
              Change Name
            </Text>
          </Dropdown.Item>
          <ChangeSelfRole onClick={() => setShowSelfRoleChange(true)} />
          {permissions?.changeRole && (
            <Dropdown.Item
              onClick={() => setShowBulkRoleChange(true)}
              data-testid="bulk_role_change_btn"
            >
              <ChangeRoleIcon />
              <Text variant="sm" css={{ ml: "$4" }}>
                Bulk Role Change
              </Text>
            </Dropdown.Item>
          )}
          <FullScreenItem />
          {isAllowedToPublish.screen && (
            <EmbedUrl setShowOpenUrl={setShowOpenUrl} />
          )}
          {permissions.mute && (
            <Dropdown.Item
              onClick={() => setShowMuteAll(true)}
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
            onClick={() => setShowDeviceSettings(true)}
            data-testid="device_settings_btn"
          >
            <SettingsIcon />
            <Text variant="sm" css={{ ml: "$4" }}>
              Settings
            </Text>
          </Dropdown.Item>
          {FeatureFlags.enableStatsForNerds &&
            Hls.isSupported() &&
            (localPeerRole === "hls-viewer" ? (
              <Dropdown.Item
                onClick={() =>
                  hmsActions.setAppData(APP_DATA.hlsStats, !enablHlsStats)
                }
                data-testid="hls_stats"
              >
                <Checkbox.Root
                  css={{ margin: "$2" }}
                  checked={enablHlsStats}
                  onCheckedChange={() =>
                    hmsActions.setAppData(APP_DATA.hlsStats, !enablHlsStats)
                  }
                >
                  <Checkbox.Indicator>
                    <CheckIcon width={16} height={16} />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <Flex justify="between" css={{ width: "100%" }}>
                  <Text variant="sm" css={{ ml: "$4" }}>
                    Show HLS Stats
                  </Text>
                  {!isMobileOS ? (
                    <Text variant="sm" css={{ ml: "$4" }}>
                      {`${isMacOS ? "⌘" : "ctrl"} + ]`}
                    </Text>
                  ) : null}
                </Flex>
              </Dropdown.Item>
            ) : (
              <Dropdown.Item
                onClick={() => setShowStatsForNerds(true)}
                data-testid="stats_for_nreds_btn"
              >
                <InfoIcon />
                <Text variant="sm" css={{ ml: "$4" }}>
                  Stats for Nerds
                </Text>
              </Dropdown.Item>
            ))}
        </Dropdown.Content>
      </Dropdown.Root>
      {showBulkRoleChange && (
        <BulkRoleChangeModal onOpenChange={setShowBulkRoleChange} />
      )}
      {showMuteAll && <MuteAllModal onOpenChange={setShowMuteAll} />}
      {showChangeNameModal && (
        <ChangeNameModal onOpenChange={setShowChangeNameModal} />
      )}
      {showDeviceSettings && (
        <SettingsModal open onOpenChange={setShowDeviceSettings} />
      )}
      {FeatureFlags.enableStatsForNerds && showStatsForNerds && (
        <StatsForNerds
          open={showStatsForNerds}
          onOpenChange={setShowStatsForNerds}
        />
      )}
      {showSelfRoleChange && (
        <RoleChangeModal
          peerId={localPeerId}
          onOpenChange={setShowSelfRoleChange}
        />
      )}
      {showStartRecording && (
        <StartRecording
          open={showStartRecording}
          onOpenChange={setShowStartRecording}
        />
      )}
      {showOpenUrl && <EmbedUrlModal onOpenChange={setShowOpenUrl} />}
    </Fragment>
  );
};
