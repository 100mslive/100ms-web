import React, { useState, useEffect } from "react";
import LogRocket from "logrocket";
import { useHMSRoom } from "@100mslive/sdk-components";

const AppContext = React.createContext();

const AppContextProvider = ({ children }) => {
  const { join, localPeer, leave } = useHMSRoom();
  //TODO refactor into multiple states
  const [state, setState] = useState({
    loginInfo: {
      token: null,
      username: "",
      role: "",
      roomId: "",
      endpoint: "",
      audioMuted: false,
      videoMuted: false,
    },
    isChatOpen: false,
    isScreenShared: false,
    maxTileCount: 8,
  });
  //TODO this should be exposed from hook and should be a status
  const [isConnected, setIsConnected] = useState(false);

  const modifiedLeave = () => {
    //TODO shoudl be moved to hook
    setIsConnected(false);
    leave();
  };
  useEffect(() => {
    let { username, role, token, endpoint } = state.loginInfo;
    if (!token) return;
    const config = {
      userName: username,
      authToken: token,
      metaData: role,
      initEndpoint: endpoint,
    };
    const listener = {
      onJoin: (room) => setIsConnected(true),
      onRoomUpdate: (type, room) => {},
      onPeerUpdate: (type, peer) => {},
      onTrackUpdate: (type, track, peer) => {},
      onError: (error) => {},
    };

    join(config, listener);
    // eslint-disable-next-line
  }, [state.loginInfo.token]);

  useEffect(() => {
    localPeer &&
      LogRocket.identify(localPeer.peerId, {
        name: state.loginInfo.username,
        role: state.loginInfo.role,
        token: state.loginInfo.token,
      });
    // eslint-disable-next-line
  }, [localPeer]);

  return (
    <AppContext.Provider
      value={{
        setLoginInfo: (info) => {
          setState({
            ...state,
            loginInfo: { ...state.loginInfo, ...info },
          });
          console.log({
            ...state,
            loginInfo: { ...state.loginInfo, ...info },
          });
        },
        toggleChat: () => {
          setState({ ...state, isChatOpen: !state.isChatOpen });
        },
        setMaxTileCount: (count) => {
          setState((prevState) => ({ ...prevState, maxTileCount: count }));
        },
        loginInfo: state.loginInfo,
        isChatOpen: state.isChatOpen,
        maxTileCount: state.maxTileCount,
        isConnected: isConnected,
        leave: modifiedLeave,
        aspectRatio: state.aspectRatio,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
