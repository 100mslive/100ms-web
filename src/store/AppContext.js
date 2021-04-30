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
      audioMuted:false,
      videoMuted:false,
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
    let { username, role, token } = state.loginInfo;
    if (!token) return;
    const config = {
      userName: username,
      authToken: token,
      metaData: role,
    };
    const listener = {
      onJoin: (room) => {
        console.debug(`app: Joined room`, room);
        setIsConnected(true);
      },

      onRoomUpdate: (type, room) => {
        console.debug(
          `app: onRoomUpdate with type ${type} and ${JSON.stringify(
            room,
            null,
            2
          )}`
        );
      },

      onPeerUpdate: (type, peer) => {
        console.debug(`app: onPeerUpdate with type ${type} and ${peer}`);
      },

      onTrackUpdate: (type, track, peer) => {
        console.debug(`app: onTrackUpdate with type ${type}`, track);
      },

      onError: (error) => {
        console.error("app: error", error);
      },
    };
    const _this = this;

    join(config, listener);
    console.debug("app: Join called");
  }, [state.loginInfo.token]);

  useEffect(() => {
    localPeer &&
      LogRocket.identify(localPeer.peerId, {
        name: state.loginInfo.username,
        role: state.loginInfo.role,
        token: state.loginInfo.token,
      });
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
