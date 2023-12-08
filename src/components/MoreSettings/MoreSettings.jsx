import React, { Fragment, useState } from "react";
import { useMedia } from "react-use";
import { HMSHLSPlayer } from "@100mslive/hls-player";
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
} from "@100mslive/roomkit-react";
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
import { useDropdownList } from "../hooks/useDropdownList";
import { useIsFeatureEnabled } from "../hooks/useFeatures";
import { FeatureFlags } from "../../services/FeatureFlags";
import {
  APP_DATA,
  FEATURE_LIST,
  isAndroid,
  isIOS,
  isMacOS,
} from "../../common/constants";

const isMobileOS = isAndroid || isIOS;

const MODALS = {
  CHANGE_NAME: "changeName",
  SELF_ROLE_CHANGE: "selfRoleChange",
  MORE_SETTINGS: "moreSettings",
  START_RECORDING: "startRecording",
  DEVICE_SETTINGS: "deviceSettings",
  STATS_FOR_NERDS: "statsForNerds",
  BULK_ROLE_CHANGE: "bulkRoleChange",
  MUTE_ALL: "muteAll",
  EMBED_URL: "embedUrl",
};

export const MoreSettings = () => {
  const permissions = useHMSStore(selectPermissions);
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const localPeerId = useHMSStore(selectLocalPeerID);
  const localPeerRole = useHMSStore(selectLocalPeerRoleName);
  const hmsActions = useHMSActions();
  const enablHlsStats = useHMSStore(selectAppData(APP_DATA.hlsStats));
  const isMobile = useMedia(cssConfig.media.md);
  const { isBrowserRecordingOn } = useRecordingStreaming();
  const isChangeNameEnabled = useIsFeatureEnabled(FEATURE_LIST.CHANGE_NAME);
  const isEmbedEnabled = useIsFeatureEnabled(FEATURE_LIST.EMBED_URL);
  const isSFNEnabled = useIsFeatureEnabled(FEATURE_LIST.STARTS_FOR_NERDS);
  const [openModals, setOpenModals] = useState(new Set());
  useDropdownList({ open: openModals.size > 0, name: "MoreSettings" });

  const updateState = (modalName, value) => {
    setOpenModals(modals => {
      const copy = new Set(modals);
      if (value) {
        // avoiding extra set state trigger which removes currently open dialog by clearing set.
        copy.clear();
        copy.add(modalName);
      } else {
        copy.delete(modalName);
      }
      return copy;
    });
  };

  return (
    <Fragment>
      <Dropdown.Root
        open={openModals.has(MODALS.MORE_SETTINGS)}
        onOpenChange={value => updateState(MODALS.MORE_SETTINGS, value)}
        modal={false}
      >
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
          css={{
            backgroundColor: "$surface_dim",
            maxHeight: "$96",
            "@md": { w: "$64" },
            "div[role='separator']:first-child": {
              display: "none",
            },
          }}
        >
          {isMobile && permissions?.browserRecording ? (
            <>
              <Dropdown.Item
                css={{ "&:hover": { backgroundColor: "$surface_bright" } }}
                onClick={() => updateState(MODALS.START_RECORDING, true)}
              >
                <RecordIcon />
                <Text variant="sm" css={{ ml: "$4" }}>
                  {isBrowserRecordingOn ? "Stop" : "Start"} Recording
                </Text>
              </Dropdown.Item>
            </>
          ) : null}
          {isChangeNameEnabled && (
            <Dropdown.Item
              css={{ "&:hover": { backgroundColor: "$surface_bright" } }}
              onClick={() => updateState(MODALS.CHANGE_NAME, true)}
              data-testid="change_name_btn"
            >
              <PencilIcon />
              <Text variant="sm" css={{ ml: "$4" }}>
                Change Name
              </Text>
            </Dropdown.Item>
          )}
          <ChangeSelfRole
            onClick={() => updateState(MODALS.SELF_ROLE_CHANGE, true)}
          />
          {permissions?.changeRole && (
            <Dropdown.Item
              css={{ "&:hover": { backgroundColor: "$surface_bright" } }}
              onClick={() => updateState(MODALS.BULK_ROLE_CHANGE, true)}
              data-testid="bulk_role_change_btn"
            >
              <ChangeRoleIcon />
              <Text variant="sm" css={{ ml: "$4" }}>
                Bulk Role Change
              </Text>
            </Dropdown.Item>
          )}
          <FullScreenItem />
          {isAllowedToPublish.screen && isEmbedEnabled && (
            <EmbedUrl
              setShowOpenUrl={() => updateState(MODALS.EMBED_URL, true)}
            />
          )}
          {permissions.mute && (
            <Dropdown.Item
              css={{ "&:hover": { backgroundColor: "$surface_bright" } }}
              onClick={() => updateState(MODALS.MUTE_ALL, true)}
              data-testid="mute_all_btn"
            >
              <MicOffIcon />
              <Text variant="sm" css={{ ml: "$4" }}>
                Mute All
              </Text>
            </Dropdown.Item>
          )}
          <Dropdown.Item
            css={{ "&:hover": { backgroundColor: "$surface_bright" } }}
            onClick={() => updateState(MODALS.DEVICE_SETTINGS, true)}
            data-testid="device_settings_btn"
          >
            <SettingsIcon />
            <Text variant="sm" css={{ ml: "$4" }}>
              Settings
            </Text>
          </Dropdown.Item>
          {FeatureFlags.enableStatsForNerds &&
            isSFNEnabled &&
            (localPeerRole === "hls-viewer" ? (
              HMSHLSPlayer.isSupported() ? (
                <Dropdown.Item
                  css={{ "&:hover": { backgroundColor: "$surface_bright" } }}
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
              ) : null
            ) : (
              <Dropdown.Item
                css={{ "&:hover": { backgroundColor: "$surface_bright" } }}
                onClick={() => updateState(MODALS.STATS_FOR_NERDS, true)}
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
      {openModals.has(MODALS.BULK_ROLE_CHANGE) && (
        <BulkRoleChangeModal
          onOpenChange={value => updateState(MODALS.BULK_ROLE_CHANGE, value)}
        />
      )}
      {openModals.has(MODALS.MUTE_ALL) && (
        <MuteAllModal
          onOpenChange={value => updateState(MODALS.MUTE_ALL, value)}
        />
      )}
      {openModals.has(MODALS.CHANGE_NAME) && (
        <ChangeNameModal
          onOpenChange={value => updateState(MODALS.CHANGE_NAME, value)}
        />
      )}
      {openModals.has(MODALS.DEVICE_SETTINGS) && (
        <SettingsModal
          open
          onOpenChange={value => updateState(MODALS.DEVICE_SETTINGS, value)}
        />
      )}
      {FeatureFlags.enableStatsForNerds &&
        openModals.has(MODALS.STATS_FOR_NERDS) && (
          <StatsForNerds
            open
            onOpenChange={value => updateState(MODALS.STATS_FOR_NERDS, value)}
          />
        )}
      {openModals.has(MODALS.SELF_ROLE_CHANGE) && (
        <RoleChangeModal
          peerId={localPeerId}
          onOpenChange={value => updateState(MODALS.SELF_ROLE_CHANGE, value)}
        />
      )}
      {openModals.has(MODALS.START_RECORDING) && (
        <StartRecording
          open
          onOpenChange={value => updateState(MODALS.START_RECORDING, value)}
        />
      )}
      {openModals.has(MODALS.EMBED_URL) && (
        <EmbedUrlModal
          onOpenChange={value => updateState(MODALS.EMBED_URL, value)}
        />
      )}
    </Fragment>
  );
};
