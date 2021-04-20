import React, { useState, useEffect } from "react";
import LogRocket from "logrocket";
import { useHMSRoom } from '@100mslive/sdk-components';

const AppContext = React.createContext();

const AppContextProvider = ({ children }) => {
  const { join, localPeer } = useHMSRoom();

  const [state, setState] = useState({
    loginInfo: {
      token: null,
      username: "",
      role: "",
    },
  });

  function addVideoTrack(track, peer) {
    setState((prevState) => {
      const streams = [...prevState.streams];
      streams.push({
        stream: track.stream.nativeStream,
        peer: {
          id: peer.peerId,
          displayName: peer.name || peer.peerId,
        },
        videoSource: "camera",
        audioLevel: 0,
        isLocal: peer.isLocal,
      });
      return { ...prevState, streams };
    });
  }

  function removeVideoTrack(track, peer) {
    setState((prevState) => {
      const streams = prevState.streams.filter(
        (stream) => stream.stream.id !== track.stream.id
      );

      return { ...prevState, streams };
    });
  }

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
        console.log(`[APP]: Joined room`, room);
      },

      onRoomUpdate: (type, room) => {
        console.log(
          `[APP]: onRoomUpdate with type ${type} and ${JSON.stringify(
            room,
            null,
            2
          )}`
        );
      },

      onPeerUpdate: (type, peer) => {
        console.log(`[APP]: onPeerUpdate with type ${type} and ${peer}`);
      },

      onTrackUpdate: (type, track, peer) => {
        console.log(`[APP]: onTrackUpdate with type ${type}`, track);
      },

      onError: (error) => {
        console.log("ERROR", error);
      },
    };
    const _this = this;

    join(config, listener);
    console.log("JOIN CALLED");

  }, [state.loginInfo.token]);

  useEffect(() => {
    localPeer && LogRocket.identify(localPeer.peerId, {
      name: state.loginInfo.username,
      role: state.loginInfo.role,
      token: state.loginInfo.token
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
        loginInfo: state.loginInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
