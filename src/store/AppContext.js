import React, { useState, useEffect } from "react";
import { useHMSRoom } from '@100mslive/sdk-components';
import LogRocket from "logrocket";

const AppContext = React.createContext();

const AppContextProvider = ({ children }) => {
  const [state, setState] = useState({
    streams: [],
    loginInfo: {
      token: null,
      username: "",
      role: "",
    },
  });

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
        LogRocket.identify(sdk.localPeer.peerId, {
          name: username,
          role, token
        });
        updatePeerState();
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
        updatePeerState();
      },

      onTrackUpdate: (type, track) => {
        console.log(`[APP]: onTrackUpdate with type ${type}`, track);
        updatePeerState();
      },

      onError: (error) => {
        console.log("ERROR", error);
      },
    };
    const _this = this;

    function updatePeerState() {
      const newStreams = useHMSRoom.peers
        .filter((peer) => Boolean(peer.videoTrack))
        .map((peer) => {
          console.log("PEER", peer);
          return {
            stream: peer.videoTrack.stream.nativeStream,
            peer: {
              id: peer.peerId,
              displayName: peer.name || peer.peerId,
            },
            videoSource: "camera",
            audioLevel: 0,
            isLocal: peer.isLocal,
          };
        });
      setState((prevState) => ({ ...prevState, streams: newStreams }));
    }

    useHMSRoom.join(config, listener);
    console.log("JOIN CALLED");

  }, [state.loginInfo.token]);

  return (
    <AppContext.Provider
      value={{
        setStreams: (streams) => {
          setState({ ...state, streams });
        },
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
        streams: state.streams,
        loginInfo: state.loginInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
