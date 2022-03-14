import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { HMSRoomProvider, HMSThemeProvider } from "@100mslive/hms-video-react";
import {
  HMSRoomProvider as ReactRoomProvider,
  HMSReactiveStore,
} from "@100mslive/react-sdk";
import { HMSThemeProvider as ReactUIProvider, Box } from "@100mslive/react-ui";
import PreviewScreen from "./components/PreviewScreen";
import { Conference } from "./components/conference";
import ErrorPage from "./components/ErrorPage";
import { AppContextProvider } from "./components/context/AppContext.js";
import { hmsToast, Notifications } from "./components/Notifications";
import { Confetti } from "./plugins/confetti";
import { ToastContainer } from "./components/Toast/ToastContainer";
import { FeatureFlags } from "./services/FeatureFlags";
import { shadeColor } from "./common/utils";
import {
  getUserToken as defaultGetUserToken,
  getBackendEndpoint,
} from "./services/tokenService";
import "./index.css";
import { PostLeave } from "./components/PostLeave";

const defaultTokenEndpoint = process.env
  .REACT_APP_TOKEN_GENERATION_ENDPOINT_DOMAIN
  ? `${getBackendEndpoint()}${
      process.env.REACT_APP_TOKEN_GENERATION_ENDPOINT_DOMAIN
    }/`
  : process.env.REACT_APP_TOKEN_GENERATION_ENDPOINT;

const envPolicyConfig = JSON.parse(process.env.REACT_APP_POLICY_CONFIG || "{}");

let appName = "";
if (window.location.host.includes("localhost")) {
  appName = "localhost";
} else {
  appName = window.location.host.split(".")[0];
}

document.title = `${appName}'s ${document.title}`;

const hmsReactiveStore = new HMSReactiveStore();

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
    metadata = "",
  },
  getUserToken = defaultGetUserToken,
  policyConfig = envPolicyConfig,
}) {
  const { 0: width, 1: height } = aspectRatio
    .split("-")
    .map(el => parseInt(el));
  const [themeType, setThemeType] = useState(theme);
  useEffect(() => {
    window.toggleUiTheme = () => {
      setThemeType(themeType === "dark" ? "light" : "dark");
    };
  }, [themeType]);
  useEffect(() => {
    setThemeType(theme);
  }, [theme]);
  return (
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
        theme: themeType,
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
      <ReactUIProvider
        themeType={themeType}
        aspectRatio={{ width, height }}
        theme={{
          colors: {
            brandDefault: color,
            brandDark: shadeColor(color, -30),
            brandLight: shadeColor(color, 30),
            brandDisabled: shadeColor(color, 10),
          },
          fonts: {
            sans: [font, "Inter", "sans-serif"],
          },
        }}
      >
        <ReactRoomProvider
          actions={hmsReactiveStore.getActions()}
          store={hmsReactiveStore.getStore()}
          notifications={hmsReactiveStore.getNotifications()}
          stats={
            FeatureFlags.enableStatsForNerds
              ? hmsReactiveStore.getStats()
              : undefined
          }
        >
          <HMSRoomProvider
            actions={hmsReactiveStore.getActions()}
            store={hmsReactiveStore.getStore()}
            notifications={hmsReactiveStore.getNotifications()}
            stats={
              FeatureFlags.enableStatsForNerds
                ? hmsReactiveStore.getStats()
                : undefined
            }
          >
            <AppContextProvider
              roomId={roomId}
              tokenEndpoint={tokenEndpoint}
              policyConfig={policyConfig}
              appDetails={metadata}
              logo={logo}
            >
              <Box
                css={{
                  bg: "$mainBg",
                  w: "100%",
                  ...(headerPresent === "true"
                    ? { flex: "1 1 0" }
                    : { h: "100%" }),
                }}
              >
                <AppRoutes getUserToken={getUserToken} />
              </Box>
            </AppContextProvider>
          </HMSRoomProvider>
        </ReactRoomProvider>
      </ReactUIProvider>
    </HMSThemeProvider>
  );
}

function AppRoutes({ getUserToken }) {
  return (
    <Router>
      <ToastContainer />
      <Notifications />
      <Confetti />
      <Switch>
        <Route
          path="/preview/:roomId/:role?"
          render={({ match }) => {
            const { params } = match;
            if (!params.roomId && !params.role) {
              return <Redirect to="/" />;
            }
            if (
              !params.roomId ||
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
        <Route path="/leave/:roomId/:role?" component={PostLeave} />
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
              <Redirect to={`/preview/${params.roomId}/${params.role || ""}`} />
            );
          }}
        />
        <Route path="*" render={() => <ErrorPage error="Invalid URL!" />} />
      </Switch>
    </Router>
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
        metadata: process.env.REACT_APP_DEFAULT_APP_DETAILS, // A stringified object in env
      }}
      getUserToken={defaultGetUserToken}
    />
  );
}
