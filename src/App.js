import React from "react";
import { JoinRoom } from "./pages/joinRoom.jsx";
import PreviewScreen from "./pages/PreviewScreen";
import { Conference } from "./pages/conference.jsx";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AppContextProvider } from "./store/AppContext.js";
import {
  HMSRoomProvider,
  HMSThemeProvider,
  PostLeaveDisplay,
} from "@100mslive/hms-video-react";
import { shadeColor } from "./common/utils";

export function EdtechComponent({
  roomId = "",
  tokenEndpoint = process.env.REACT_APP_TOKEN_GENERATION_ENDPOINT,
  themeConfig: {
    aspectRatio = "1-1",
    font = "Roboto",
    color = "#2F80FF",
    theme = "dark",
    showChat = "true",
    showScreenshare = "true",
    logo = "",
    showAvatar = "true",
    avatarType = "initial",
  },
}) {
  const { 0: width, 1: height } = aspectRatio
    .split("-")
    .map(el => parseInt(el));
  return (
    <div className="w-full h-screen dark:bg-black">
      <HMSThemeProvider
        config={{
          theme: {
            extend: {
              fontFamily: {
                sans: [font, "Inter", "sans-serif"],
                body: [font, "Inter", "sans-serif"],
              },
              colors: {
                brand: {
                  main: color,
                  tint: shadeColor(color, 30),
                },
              },
            },
          },
        }}
        appBuilder={{
          theme: theme || "dark",
          enableChat: showChat === "true",
          enableScreenShare: showScreenshare === "true",
          logo: logo,
          videoTileAspectRatio: { width, height },
          showAvatar: showAvatar === "true",
          avatarType: avatarType,
        }}
      >
        <HMSRoomProvider>
          <AppContextProvider roomId={roomId} tokenEndpoint={tokenEndpoint}>
            <Router>
              <Switch>
                {/* <Route path="/createRoom">
              <CreateRoom />
            </Route> */}
                <Route path="/preview/:roomId?">
                  <PreviewScreen />
                </Route>
                <Route path="/meeting/:roomId?">
                  <Conference />
                </Route>
                <Route
                  path="/leave/:roomId"
                  render={({ history, match }) => (
                    <PostLeaveDisplay
                      goToDashboardOnClick={() => {
                        window.open("https://dashboard.100ms.live/", "_blank");
                      }}
                      joinRoomOnClick={() => {
                        history.push("/" + match.params.roomId);
                      }}
                    />
                  )}
                ></Route>
                <Route path="/:roomId?">
                  <JoinRoom />
                </Route>
              </Switch>
            </Router>
          </AppContextProvider>
        </HMSRoomProvider>
      </HMSThemeProvider>
    </div>
  );
}

export default function App() {
  return (
    <EdtechComponent
      themeConfig={{
        aspectRatio: process.env.REACT_APP_TILE_SHAPE,
        theme: process.env.REACT_APP_THEME,
        color: process.env.REACT_APP_COLOR,
        logo: process.env.REACT_APP_LOGO,
        font: process.env.REACT_APP_FONT,
        showChat: process.env.REACT_APP_SHOW_CHAT,
        showScreenshare: process.env.REACT_APP_SHOW_SCREENSHARE,
        showAvatar: process.env.REACT_APP_VIDEO_AVATAR,
        avatarType: process.env.REACT_APP_AVATAR_TYPE,
      }}
    />
  );
}
