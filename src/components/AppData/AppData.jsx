import React, { useEffect } from "react";
import { useSearchParam } from "react-use";
import {
  selectAvailableRoleNames,
  selectHLSState,
  selectIsConnectedToRoom,
  selectLocalPeerRoleName,
  selectRolesMap,
  selectRTMPState,
  useHMSActions,
  useHMSStore,
  useRecordingStreaming,
} from "@100mslive/react-sdk";
import { normalizeAppPolicyConfig } from "../init/initUtils";
import {
  UserPreferencesKeys,
  useUserPreferences,
} from "../hooks/useUserPreferences";
import {
  useIsSidepaneTypeOpen,
  useSidepaneReset,
  useSidepaneState,
  useSidepaneToggle,
} from "./useSidepane";
import { useSetAppDataByKey } from "./useUISettings";
import { getMetadata } from "../../common/utils";
import {
  APP_DATA,
  DEFAULT_HLS_ROLE_KEY,
  DEFAULT_HLS_VIEWER_ROLE,
  QUERY_PARAM_VIEW_MODE,
  SIDE_PANE_OPTIONS,
  UI_MODE_ACTIVE_SPEAKER,
  UI_MODE_GRID,
  UI_SETTINGS,
} from "../../common/constants";

export const getAppDetails = appDetails => {
  try {
    return !appDetails ? {} : JSON.parse(appDetails);
  } catch (error) {
    return {};
  }
};

const initialAppData = {
  [APP_DATA.uiSettings]: {
    [UI_SETTINGS.isAudioOnly]: false,
    [UI_SETTINGS.isHeadless]: false,
    [UI_SETTINGS.maxTileCount]: 9,
    [UI_SETTINGS.showStatsOnTiles]: false,
    [UI_SETTINGS.enableAmbientMusic]: false,
    [UI_SETTINGS.uiViewMode]: UI_MODE_GRID,
    [UI_SETTINGS.mirrorLocalVideo]: true,
  },
  [APP_DATA.subscribedNotifications]: {
    PEER_JOINED: false,
    PEER_LEFT: false,
    NEW_MESSAGE: true,
    ERROR: true,
    METADATA_UPDATED: true,
  },
  [APP_DATA.chatOpen]: false,
  [APP_DATA.chatDraft]: "",
  [APP_DATA.sidePane]: "",
  [APP_DATA.hlsStarted]: false,
  [APP_DATA.rtmpStarted]: false,
  [APP_DATA.recordingStarted]: false,
  [APP_DATA.hlsViewerRole]: DEFAULT_HLS_VIEWER_ROLE,
};

export const AppData = React.memo(
  ({ appDetails, logo, recordingUrl, tokenEndpoint, policyConfig }) => {
    const hmsActions = useHMSActions();
    const isConnected = useHMSStore(selectIsConnectedToRoom);
    const sidePane = useSidepaneState();
    const resetSidePane = useSidepaneReset();
    const [preferences = {}] = useUserPreferences(
      UserPreferencesKeys.UI_SETTINGS
    );
    const roleNames = useHMSStore(selectAvailableRoleNames);
    const rolesMap = useHMSStore(selectRolesMap);
    const localPeerRole = useHMSStore(selectLocalPeerRoleName);
    const isDefaultModeActiveSpeaker =
      useSearchParam(QUERY_PARAM_VIEW_MODE) === UI_MODE_ACTIVE_SPEAKER;

    useEffect(() => {
      if (
        !isConnected &&
        sidePane &&
        sidePane !== SIDE_PANE_OPTIONS.PARTICIPANTS
      ) {
        resetSidePane();
      }
    }, [isConnected, sidePane, resetSidePane]);

    useEffect(() => {
      hmsActions.initAppData(initialAppData);
    }, [hmsActions]);

    useEffect(() => {
      const uiSettings = preferences.uiSettings || {};
      const updatedSettings = {
        ...uiSettings,
        [UI_SETTINGS.uiViewMode]: isDefaultModeActiveSpeaker
          ? UI_MODE_ACTIVE_SPEAKER
          : uiSettings.uiViewMode || UI_MODE_GRID,
      };
      hmsActions.setAppData(APP_DATA.uiSettings, updatedSettings, true);
    }, [preferences.uiSettings, isDefaultModeActiveSpeaker, hmsActions]);

    useEffect(() => {
      const appData = {
        [APP_DATA.recordingUrl]: recordingUrl,
        [APP_DATA.tokenEndpoint]: tokenEndpoint,
        [APP_DATA.logo]: logo,
        [APP_DATA.hlsViewerRole]:
          getMetadata(appDetails)[DEFAULT_HLS_ROLE_KEY] ||
          DEFAULT_HLS_VIEWER_ROLE,
        [APP_DATA.appConfig]: getAppDetails(appDetails),
      };
      for (const key in appData) {
        hmsActions.setAppData([key], appData[key]);
      }
    }, [appDetails, logo, recordingUrl, tokenEndpoint, hmsActions]);

    useEffect(() => {
      if (!preferences.subscribedNotifications) {
        return;
      }
      hmsActions.setAppData(
        APP_DATA.subscribedNotifications,
        preferences.subscribedNotifications,
        true
      );
    }, [preferences.subscribedNotifications, hmsActions]);

    useEffect(() => {
      if (localPeerRole) {
        const config = normalizeAppPolicyConfig(
          roleNames,
          rolesMap,
          policyConfig
        );
        hmsActions.setAppData(APP_DATA.appLayout, config[localPeerRole]);
      }
    }, [roleNames, policyConfig, rolesMap, localPeerRole, hmsActions]);

    return <ResetStreamingStart />;
  }
);

/**
 * reset hlsStarted, rtmpStarted values when streaming starts
 */
const ResetStreamingStart = () => {
  const { isHLSRunning, isRTMPRunning, isBrowserRecordingOn } =
    useRecordingStreaming();
  const hlsError = useHMSStore(selectHLSState).error;
  const rtmpError = useHMSStore(selectRTMPState).error;
  const [hlsStarted, setHLSStarted] = useSetAppDataByKey(APP_DATA.hlsStarted);
  const [recordingStarted, setRecordingStarted] = useSetAppDataByKey(
    APP_DATA.recordingStarted
  );
  const [rtmpStarted, setRTMPStarted] = useSetAppDataByKey(
    APP_DATA.rtmpStarted
  );
  const toggleStreaming = useSidepaneToggle(SIDE_PANE_OPTIONS.STREAMING);
  const isStreamingOpen = useIsSidepaneTypeOpen(SIDE_PANE_OPTIONS.STREAMING);

  useEffect(() => {
    if (isBrowserRecordingOn && recordingStarted) {
      setRecordingStarted(false);
    }
  }, [isBrowserRecordingOn, recordingStarted, setRecordingStarted]);
  useEffect(() => {
    if (isHLSRunning || hlsError) {
      if (hlsStarted) {
        setHLSStarted(false);
        if (isStreamingOpen) {
          toggleStreaming();
        }
      }
    }
  }, [
    isHLSRunning,
    hlsStarted,
    setHLSStarted,
    hlsError,
    isStreamingOpen,
    toggleStreaming,
  ]);
  useEffect(() => {
    if (isRTMPRunning || rtmpError || isBrowserRecordingOn) {
      if (rtmpStarted) {
        setRTMPStarted(false);
        if (isStreamingOpen) {
          toggleStreaming();
        }
      }
    }
  }, [
    isRTMPRunning,
    setRTMPStarted,
    rtmpStarted,
    rtmpError,
    isBrowserRecordingOn,
    isStreamingOpen,
    toggleStreaming,
  ]);
  return null;
};
