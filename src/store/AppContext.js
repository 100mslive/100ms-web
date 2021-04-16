import React, { Component } from "react";
import { streamsWithInfo } from "./data";

const AppContext = React.createContext();

class AppContextProvider extends Component {
  state = {
    client: null,
    loginInfo: {
      roomName: "",
      roomId: "",
      displayName: "",
      role: "Teacher",
      env: "",
    },
    settings: {
      selectedAudioDevice: "",
      selectedVideoDevice: "",
      resolution: "qvga",
      bandwidth: 256,
      codec: "vp8",
      frameRate: 30,
      isDevMode: false,
      shouldApplyConstraints: false,
    },
    roomState: {
      screenSharingEnabled: false,
      localStream: null,
      localScreen: null,
      audioMuted: false,
      videoMuted: false,
      mode: "",
      pinned: false,
      streamsInfo: [],
      pinned: false,
      streamsWithInfo: streamsWithInfo,
    },
  };
  render() {
    return (
      <AppContext.Provider
        value={{
          loginInfo: this.state.loginInfo,
          settings: this.state.settings,
          client: this.state.client,
          streamsWithInfo: this.state.roomState.streamsWithInfo,
          localStreamError: this.state.localStreamError,
          roomState: this.state.roomState,

          setSettings: (settings, cb) => {
            this.setState(
              {
                settings: { ...this.state.settings, ...settings },
              },
              () => {
                cb && cb();
              }
            );
          },
          setLoginInfo: (loginInfo) => {
            this.setState({
              loginInfo: { ...this.state.loginInfo, ...loginInfo },
            });
            if (loginInfo.displayName) {
              localStorage.setItem(
                "loginInfo.displayName",
                loginInfo.displayName
              );
            }
          },
          setClient: (client) => {
            this.setState({
              client: client,
            });
          },
          setRoomState: (roomState) => {
            this.setState({
              roomState: { ...this.state.roomState, ...roomState },
            });
          },
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export { AppContext, AppContextProvider };
