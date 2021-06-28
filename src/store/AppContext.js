import React, { useState, useEffect, useCallback } from "react";
import {
  useHMSActions,
  useHMSStore,
  selectLocalPeer,
  selectIsConnectedToRoom,
} from "@100mslive/hms-video-react";
import {
  convertLoginInfoToJoinConfig,
  setUpLogRocket,
} from "./appContextUtils";
import { backendEndPoint } from '../services/tokenService'

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
};

const AppContextProvider = ({
  roomId = "",
  tokenEndpoint = backendEndPoint + process.env.REACT_APP_TOKEN_GENERATION_ENDPOINT_DOMAIN,
  children,
}) => {
  const hmsActions = useHMSActions();
  const localPeer = useHMSStore(selectLocalPeer);
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  initialLoginInfo.roomId = roomId;

  const [state, setState] = useState({
    loginInfo: initialLoginInfo,
    maxTileCount: 9,
  });

  const customLeave = useCallback(() => {
    console.log("User is leaving the room");
    hmsActions.leave();
  }, [hmsActions]);

  useEffect(() => {
    if (!state.loginInfo.token) return;
    hmsActions.join(convertLoginInfoToJoinConfig(state.loginInfo));
    // eslint-disable-next-line
  }, [state.loginInfo.token]); // to avoid calling join again, call it only when token is changed

  useEffect(() => {
    localPeer && setUpLogRocket(state.loginInfo, localPeer);
    // eslint-disable-next-line
  }, [localPeer?.id]);

  // deep set with clone so react re renders on any change
  const deepSetLoginInfo = loginInfo => {
    const newState = {
      ...state,
      loginInfo: { ...state.loginInfo, ...loginInfo },
    };
    setState(newState);
    console.log(newState); // note: component won't reflect changes at time of this log
  };

  const deepSetMaxTiles = maxTiles => {
    setState(prevState => ({ ...prevState, maxTileCount: maxTiles }));
  };

  window.onunload = () => customLeave();

  return (
    <AppContext.Provider
      value={{
        setLoginInfo: deepSetLoginInfo,
        setMaxTileCount: deepSetMaxTiles,
        loginInfo: state.loginInfo,
        maxTileCount: state.maxTileCount,
        isConnected: isConnected,
        leave: customLeave,
        tokenEndpoint,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
