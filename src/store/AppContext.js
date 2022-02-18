import React, { useState, useEffect, useMemo } from "react";
import {
  useHMSStore,
  selectLocalPeer,
  selectAvailableRoleNames,
  selectRolesMap,
  selectSessionId,
} from "@100mslive/react-sdk";
import { FeatureFlagsInit } from "./FeatureFlags";
import { normalizeAppPolicyConfig, setUpLogRocket } from "./appContextUtils";
import { getBackendEndpoint } from "../services/tokenService";
import {
  UI_SETTINGS_KEY,
  DEFAULT_HLS_ROLE_KEY,
  DEFAULT_HLS_VIEWER_ROLE,
} from "../common/constants";
import { getMetadata } from "../common/utils";

const AppContext = React.createContext(null);

const initialLoginInfo = {
  token: null,
  role: "",
  roomId: "",
  env: process.env.REACT_APP_ENV
    ? process.env.REACT_APP_ENV + "-in"
    : "prod-in",
  isHeadlessMode: false,
};

const defaultTokenEndpoint = process.env
  .REACT_APP_TOKEN_GENERATION_ENDPOINT_DOMAIN
  ? `${getBackendEndpoint()}${
      process.env.REACT_APP_TOKEN_GENERATION_ENDPOINT_DOMAIN
    }/`
  : process.env.REACT_APP_TOKEN_GENERATION_ENDPOINT;

const envPolicyConfig = JSON.parse(process.env.REACT_APP_POLICY_CONFIG || "{}");
const envAudioPlaylist = JSON.parse(
  process.env.REACT_APP_AUDIO_PLAYLIST || "[]"
);
const envVideoPlaylist = JSON.parse(
  process.env.REACT_APP_VIDEO_PLAYLIST || "[]"
);

const defaultUiSettings = {
  maxTileCount: 9,
  subscribedNotifications: {
    PEER_JOINED: false,
    PEER_LEFT: false,
    NEW_MESSAGE: false,
    ERROR: true,
    METADATA_UPDATED: true,
  },
  uiViewMode: "grid",
  showStatsOnTiles: false,
  enableAmbientMusic: false,
};

const uiSettingsFromStorage = localStorage.getItem(UI_SETTINGS_KEY)
  ? JSON.parse(localStorage.getItem(UI_SETTINGS_KEY))
  : defaultUiSettings;

const AppContextProvider = ({
  tokenEndpoint = defaultTokenEndpoint,
  policyConfig = envPolicyConfig,
  audioPlaylist = envAudioPlaylist,
  videoPlaylist = envVideoPlaylist,
  children,
  appDetails,
}) => {
  const localPeer = useHMSStore(selectLocalPeer);
  const roleNames = useHMSStore(selectAvailableRoleNames);
  const rolesMap = useHMSStore(selectRolesMap);
  const sessionId = useHMSStore(selectSessionId);
  const appPolicyConfig = useMemo(
    () => normalizeAppPolicyConfig(roleNames, rolesMap, policyConfig),
    [roleNames, policyConfig, rolesMap]
  );

  const [state, setState] = useState({
    loginInfo: initialLoginInfo,
    maxTileCount: uiSettingsFromStorage.maxTileCount,
    localAppPolicyConfig: {},
    subscribedNotifications:
      uiSettingsFromStorage.subscribedNotifications || {},
    uiViewMode: uiSettingsFromStorage.uiViewMode || "grid",
    showStatsOnTiles: uiSettingsFromStorage.showStatsOnTiles || false,
    enableAmbientMusic: uiSettingsFromStorage.enableAmbientMusic || false,
  });

  useEffect(() => {
    localStorage.setItem(
      UI_SETTINGS_KEY,
      JSON.stringify({
        maxTileCount: state.maxTileCount,
        subscribedNotifications: state.subscribedNotifications,
        uiViewMode: state.uiViewMode,
        showStatsOnTiles: state.showStatsOnTiles,
        enableAmbientMusic: state.enableAmbientMusic,
      })
    );
  }, [
    state.maxTileCount,
    state.subscribedNotifications,
    state.uiViewMode,
    state.showStatsOnTiles,
    state.enableAmbientMusic,
  ]);

  useEffect(() => {
    function resetHeight() {
      // reset the body height to that of the inner browser
      document.body.style.height = `${window.innerHeight}px`;
    }
    // reset the height whenever the window's resized
    window.addEventListener("resize", resetHeight);
    // called to initially set the height.
    resetHeight();
    return () => {
      window.removeEventListener("resize", resetHeight);
    };
  }, []);

  useEffect(() => {
    localPeer &&
      setUpLogRocket({ localPeer, sessionId, roomId: state.loginInfo.roomId });
    // eslint-disable-next-line
  }, [
    localPeer?.id,
    localPeer?.name,
    localPeer?.roleName,
    state.loginInfo.roomId,
    sessionId,
  ]);

  useEffect(() => {
    localPeer && deepSetAppPolicyConfig(appPolicyConfig[localPeer.roleName]);
  }, [localPeer, localPeer?.roleName, appPolicyConfig]);

  // deep set with clone so react re renders on any change
  const deepSetLoginInfo = loginInfo => {
    const newState = {
      ...state,
      loginInfo: { ...state.loginInfo, ...loginInfo },
    };
    setState(newState);
    console.log(newState); // note: component won't reflect changes at time of this log
  };

  const deepSetMaxTiles = maxTiles =>
    setState(prevState => ({ ...prevState, maxTileCount: maxTiles }));

  const deepSetAppPolicyConfig = config =>
    setState(prevState => ({ ...prevState, localAppPolicyConfig: config }));

  const deepSetSubscribedNotifications = notification =>
    setState(prevState => ({
      ...prevState,
      subscribedNotifications: {
        ...prevState.subscribedNotifications,
        [notification.type]: notification.isSubscribed,
      },
    }));

  const deepSetuiViewMode = layout =>
    setState(prevState => ({ ...prevState, uiViewMode: layout }));

  const deepSetShowStatsOnTiles = show =>
    setState(prevState => ({ ...prevState, showStatsOnTiles: show }));

  const deepSetEnableAmbientMusic = enable =>
    setState(prevState => ({ ...prevState, enableAmbientMusic: enable }));

  return (
    <AppContext.Provider
      value={{
        setLoginInfo: deepSetLoginInfo,
        setMaxTileCount: deepSetMaxTiles,
        setSubscribedNotifications: deepSetSubscribedNotifications,
        setuiViewMode: deepSetuiViewMode,
        setShowStatsOnTiles: deepSetShowStatsOnTiles,
        setEnableAmbientMusic: deepSetEnableAmbientMusic,
        enableAmbientMusic: state.enableAmbientMusic,
        showStatsOnTiles: state.showStatsOnTiles,
        uiViewMode: state.uiViewMode,
        loginInfo: state.loginInfo,
        maxTileCount: state.maxTileCount,
        subscribedNotifications: state.subscribedNotifications,
        appPolicyConfig: state.localAppPolicyConfig,
        HLS_VIEWER_ROLE:
          getMetadata(appDetails)[DEFAULT_HLS_ROLE_KEY] ||
          DEFAULT_HLS_VIEWER_ROLE,
        tokenEndpoint,
        audioPlaylist,
        videoPlaylist,
      }}
    >
      {children}
      <FeatureFlagsInit />
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
