import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import {
  HMSRoomProvider,
  HMSThemeProvider,
  PostLeaveDisplay,
} from "@100mslive/hms-video-react";
import PreviewScreen from "./pages/PreviewScreen";
import { Conference } from "./pages/conference.jsx";
import ErrorPage from "./pages/ErrorPage";
import { AppContextProvider } from "./store/AppContext.js";
import { shadeColor } from "./common/utils";
import {
  getUserToken as defaultGetUserToken,
  getBackendEndpoint,
} from "./services/tokenService";
import { hmsToast } from "./views/components/notifications/hms-toast";

const defaultTokenEndpoint = process.env
  .REACT_APP_TOKEN_GENERATION_ENDPOINT_DOMAIN
  ? `${getBackendEndpoint()}${
      process.env.REACT_APP_TOKEN_GENERATION_ENDPOINT_DOMAIN
    }/`
  : process.env.REACT_APP_TOKEN_GENERATION_ENDPOINT;

export function EdtechComponent({
  roomId = "",
  tokenEndpoint = defaultTokenEndpoint,
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
    headerPresent = "false",
    logoClass = "",
  },
  getUserToken = defaultGetUserToken,
}) {
  const { 0: width, 1: height } = aspectRatio
    .split("-")
    .map(el => parseInt(el));
  return (
    <div
      className={`w-full dark:bg-black ${
        headerPresent === "true" ? "flex-1" : "h-full"
      }`}
    >
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
          logoClass: logoClass,
          headerPresent: headerPresent === "true",
          videoTileAspectRatio: { width, height },
          showAvatar: showAvatar === "true",
          avatarType: avatarType,
        }}
        toast={(message, options = {}) => hmsToast(message, options)}
      >
        <HMSRoomProvider>
          <AppContextProvider roomId={roomId} tokenEndpoint={tokenEndpoint}>
            <Router>
              <Switch>
                {/* <Route path="/createRoom">
              <CreateRoom />
            </Route> */}
                <Route
                  path="/preview/:roomId/:role?"
                  render={({ match }) => {
                    const { params } = match;
                    if (!params.roomId || !params.role) {
                      return <Redirect to="/" />;
                    }
                    if (
                      ["preview", "meeting", "leave"].includes(params.roomId)
                    ) {
                      return <Redirect to="/" />;
                    }
                    return <PreviewScreen getUserToken={getUserToken} />;
                  }}
                />
                <Route path="/meeting/:roomId/:role?">
                  <Conference />
                </Route>
                <Route
                  path="/leave/:roomId/:role?"
                  render={({ history, match }) => (
                    <PostLeaveDisplay
                      goToDashboardOnClick={() => {
                        window.open("https://dashboard.100ms.live/", "_blank");
                      }}
                      joinRoomOnClick={() => {
                        let previewUrl = "/preview/" + match.params.roomId;
                        if (match.params.role)
                          previewUrl += "/" + match.params.role;
                        history.push(previewUrl);
                      }}
                    />
                  )}
                />
                <Route
                  path="/:roomId/:role?"
                  render={({ match }) => {
                    const { params } = match;
                    if (!params.roomId && !params.role) {
                      return <Redirect to="/" />;
                    }
                    if (!params.roomId) {
                      return <Redirect to="/" />;
                    }
                    return (
                      <Redirect
                        to={`/preview/${params.roomId}/${params.role || ""}`}
                      />
                    );
                  }}
                />
                <Route
                  path="*"
                  render={() => <ErrorPage error="Invalid URL!" />}
                />
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
        logoClass: process.env.REACT_APP_LOGO_CLASS,
        headerPresent: process.env.REACT_APP_HEADER_PRESENT,
      }}
      getUserToken={defaultGetUserToken}
    />
  );
}
