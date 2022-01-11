import React, { useState, useEffect, useMemo } from "react";
import {
  useHMSActions,
  useHMSStore,
  selectLocalPeer,
  selectAvailableRoleNames,
  selectRolesMap,
} from "@100mslive/hms-video-react";
import { FeatureFlagsInit } from "./FeatureFlags";
import {
  convertLoginInfoToJoinConfig,
  normalizeAppPolicyConfig,
  setUpLogRocket,
} from "./appContextUtils";
import { getBackendEndpoint } from "../services/tokenService";
import {
  UI_SETTINGS_KEY,
  USERNAME_KEY,
  DEFAULT_HLS_ROLE_KEY,
  DEFAULT_HLS_VIEWER_ROLE,
} from "../common/constants";
import { getMetadata } from "../common/utils";

const AppContext = React.createContext(null);

const initialLoginInfo = {
  token: null,
  username: "",
  role: "",
  roomId: "",
  env: process.env.REACT_APP_ENV
    ? process.env.REACT_APP_ENV + "-in"
    : "prod-in",
  audioMuted: false,
  videoMuted: false,
  selectedVideoInput: "default",
  selectedAudioInput: "default",
  selectedAudioOutput: "default",
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
};

const uiSettingsFromStorage = localStorage.getItem(UI_SETTINGS_KEY)
  ? JSON.parse(localStorage.getItem(UI_SETTINGS_KEY))
  : defaultUiSettings;

const AppContextProvider = ({
  roomId = "",
  tokenEndpoint = defaultTokenEndpoint,
  policyConfig = envPolicyConfig,
  audioPlaylist = envAudioPlaylist,
  videoPlaylist = envVideoPlaylist,
  children,
  appDetails,
}) => {
  const hmsActions = useHMSActions();
  const localPeer = useHMSStore(selectLocalPeer);
  const roleNames = useHMSStore(selectAvailableRoleNames);
  const rolesMap = useHMSStore(selectRolesMap);
  const appPolicyConfig = useMemo(
    () => normalizeAppPolicyConfig(roleNames, rolesMap, policyConfig),
    [roleNames, policyConfig, rolesMap]
  );
  initialLoginInfo.roomId = roomId;

  const [state, setState] = useState({
    loginInfo: initialLoginInfo,
    maxTileCount: uiSettingsFromStorage.maxTileCount,
    localAppPolicyConfig: {},
    subscribedNotifications:
      uiSettingsFromStorage.subscribedNotifications || {},
    uiViewMode: uiSettingsFromStorage.uiViewMode || "grid",
    showStatsOnTiles: uiSettingsFromStorage.showStatsOnTiles || false,
  });

  useEffect(() => {
    localStorage.setItem(
      UI_SETTINGS_KEY,
      JSON.stringify({
        maxTileCount: state.maxTileCount,
        subscribedNotifications: state.subscribedNotifications,
        uiViewMode: state.uiViewMode,
        showStatsOnTiles: state.showStatsOnTiles,
      })
    );
  }, [
    state.maxTileCount,
    state.subscribedNotifications,
    state.uiViewMode,
    state.showStatsOnTiles,
  ]);

  useEffect(() => {
    if (state.loginInfo.username) {
      localStorage.setItem(USERNAME_KEY, state.loginInfo.username);
    }
  }, [state.loginInfo.username]);

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
    if (!state.loginInfo.token) return;
    hmsActions.join(convertLoginInfoToJoinConfig(state.loginInfo));
    // eslint-disable-next-line
  }, [state.loginInfo.token]); // to avoid calling join again, call it only when token is changed

  useEffect(() => {
    localPeer && setUpLogRocket(state.loginInfo, localPeer);
    // eslint-disable-next-line
  }, [localPeer?.id]);

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

  return (
    <AppContext.Provider
      value={{
        setLoginInfo: deepSetLoginInfo,
        setMaxTileCount: deepSetMaxTiles,
        setSubscribedNotifications: deepSetSubscribedNotifications,
        setuiViewMode: deepSetuiViewMode,
        setShowStatsOnTiles: deepSetShowStatsOnTiles,
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
