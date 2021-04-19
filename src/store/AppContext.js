import React, { useState, useEffect } from "react";
import { HMSSdk, HMSTrackUpdate, HMSTrackType } from "@100mslive/100ms-web-sdk";
import LogRocket from "logrocket";

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
    const sdk = new HMSSdk();
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
          role,
          token,
        });
        addVideoTrack(sdk.localPeer.videoTrack, sdk.localPeer);
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
        if (type === HMSTrackUpdate.TRACK_ADDED) {
          if (track.type === HMSTrackType.VIDEO) addVideoTrack(track, peer);
        } else if (type === HMSTrackUpdate.TRACK_REMOVED) {
          if (track.type === HMSTrackType.VIDEO) {
            removeVideoTrack(track, peer);
          }
        }
      },

      onError: (error) => {
        console.log("ERROR", error);
      },
    };

    sdk.join(config, listener);
    console.log(sdk, "set here");
    setState((prevState) => ({ ...prevState, sdk }));

    window.onunload = function () {
      alert("leaving");
      sdk.leave();
    };
  }, [state.loginInfo]);

  return (
    <AppContext.Provider
      value={{
        setStreams: (streams) => {
          setState({ ...state, streams });
        },
        addVideoTrack,
        removeVideoTrack,
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
