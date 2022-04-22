import React, { Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { HMSRoomProvider } from "@100mslive/react-sdk";
import { HMSThemeProvider, Box } from "@100mslive/react-ui";
import { AppContextProvider } from "./components/context/AppContext.js";
import { Notifications } from "./components/Notifications";
import { Confetti } from "./plugins/confetti";
import { ToastContainer } from "./components/Toast/ToastContainer";
import { FeatureFlags } from "./services/FeatureFlags";
import { shadeColor } from "./common/utils";
import {
  getUserToken as defaultGetUserToken,
  getBackendEndpoint,
} from "./services/tokenService";
import "./base.css";
import "./index.css";
import LogoForLight from "./images/logo-dark.svg";
import LogoForDark from "./images/logo-light.svg";
import FullPageProgress from "./components/FullPageProgress";
import { KeyboardHandler } from "./components/Input/KeyboardInputManager";

const Conference = React.lazy(() => import("./components/conference"));
const PreviewScreen = React.lazy(() => import("./components/PreviewScreen"));
const ErrorPage = React.lazy(() => import("./components/ErrorPage"));
const PostLeave = React.lazy(() => import("./components/PostLeave"));

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

export function EdtechComponent({
  roomId = "",
  tokenEndpoint = defaultTokenEndpoint,
  themeConfig: {
    aspectRatio = "1-1",
    font = "Roboto",
    color = "#2F80FF",
    theme = "dark",
    logo = "",
    headerPresent = "false",
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
      <HMSRoomProvider isHMSStatsOn={FeatureFlags.enableStatsForNerds}>
        <AppContextProvider
          roomId={roomId}
          tokenEndpoint={tokenEndpoint}
          policyConfig={policyConfig}
          appDetails={metadata}
          logo={logo || (theme === "dark" ? LogoForDark : LogoForLight)}
        >
          <Box
            css={{
              bg: "$mainBg",
              w: "100%",
              ...(headerPresent === "true"
                ? { flex: "1 1 0", minHeight: 0 }
                : { h: "100%" }),
            }}
          >
            <AppRoutes getUserToken={getUserToken} />
          </Box>
        </AppContextProvider>
      </HMSRoomProvider>
    </HMSThemeProvider>
  );
}

function AppRoutes({ getUserToken }) {
  return (
    <Router>
      <ToastContainer />
      <Notifications />
      <Confetti />
      <KeyboardHandler />
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
            return (
              <Suspense fallback={<FullPageProgress />}>
                <PreviewScreen getUserToken={getUserToken} />
              </Suspense>
            );
          }}
        />
        <Route path="/meeting/:roomId/:role?">
          <Suspense fallback={<FullPageProgress />}>
            <Conference />
          </Suspense>
        </Route>
        <Route path="/leave/:roomId/:role?">
          <Suspense fallback={<FullPageProgress />}>
            <PostLeave />
          </Suspense>
        </Route>
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
        <Route path="*">
          <Suspense fallback={<FullPageProgress />}>
            <ErrorPage error="Invalid URL!" />
          </Suspense>
        </Route>
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
        headerPresent: process.env.REACT_APP_HEADER_PRESENT,
        metadata: process.env.REACT_APP_DEFAULT_APP_DETAILS, // A stringified object in env
      }}
      getUserToken={defaultGetUserToken}
    />
  );
}
