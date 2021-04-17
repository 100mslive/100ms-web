import React, { Component } from "react";
import HMSSdk from "@100mslive/100ms-web-sdk";

const AppContext = React.createContext();

class AppContextProvider extends Component {
  state = {
    streams: [],
    loginInfo: {
      token: null,
      username: "",
      role: "",
    },
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.loginInfo.token !== this.state.loginInfo.token) {
      let { username, role, token } = this.state.loginInfo;
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
        _this.setState({ ..._this.state, streams: newStreams });
      }

      sdk.join(config, listener);

      window.onunload = function () {
        alert("leaving");
        sdk.leave();
      };
    }
  }

  render() {
    return (
      <AppContext.Provider
        value={{
          setStreams: (streams) => {
            this.setState({ ...this.state, streams });
          },
          setLoginInfo: (info) => {
            this.setState({
              ...this.state,
              loginInfo: { ...this.state.loginInfo, ...info },
            });
            console.log({
              ...this.state,
              loginInfo: { ...this.state.loginInfo, ...info },
            });
          },
          streams: this.state.streams,
          loginInfo: this.state.loginInfo,
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export { AppContext, AppContextProvider };
