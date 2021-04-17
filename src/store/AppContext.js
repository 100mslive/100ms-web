import React, { useState, useEffect } from "react";
import HMSSdk from "@100mslive/100ms-web-sdk";

const AppContext = React.createContext();

const AppContextProvider = ({ children }) => {
  const [state, setState] = useState({
    sdk: null,
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
    const sdk = new HMSSdk();
    const config = {
      userName: username,
      authToken: token,
      metaData: role,
    };
    const listener = {
      onJoin: (room) => {
        console.log(`[APP]: Joined room`, room);
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
      const newStreams = sdk
        .getPeers()
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

    sdk.join(config, listener);
    console.log(sdk, "set here");
    setState((prevState) => ({ ...prevState, sdk }));

    window.onunload = function () {
      alert("leaving");
      sdk.leave();
    };
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
        sdk: state.sdk,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
