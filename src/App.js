import React, { Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
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
import PostLeave from "./components/PostLeave";
import { AppData } from "./components/AppData/AppData.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary";

const Conference = React.lazy(() => import("./components/conference"));
const PreviewScreen = React.lazy(() => import("./components/PreviewScreen"));
const ErrorPage = React.lazy(() => import("./components/ErrorPage"));

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

const getAspectRatio = ({ width, height }) => {
  const host = process.env.REACT_APP_HOST_NAME || window.location.hostname;
  const portraitDomains = (
    process.env.REACT_APP_PORTRAIT_MODE_DOMAINS || ""
  ).split(",");
  if (portraitDomains.includes(host) && width > height) {
    return { width: height, height: width };
  }
  return { width, height };
};

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
    <ErrorBoundary>
      <HMSThemeProvider
        themeType={themeType}
        aspectRatio={getAspectRatio({ width, height })}
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
              <AppRoutes getUserToken={getUserToken} appDetails={metadata} />
            </Box>
          </AppContextProvider>
        </HMSRoomProvider>
      </HMSThemeProvider>
    </ErrorBoundary>
  );
}

const RedirectToPreview = () => {
  const { roomId, role } = useParams();

  if (!roomId && !role) {
    return <Navigate to="/" />;
  }
  if (!roomId) {
    return <Navigate to="/" />;
  }
  if (["preview", "meeting", "leave"].includes(roomId) && !role) {
    return <Navigate to="/" />;
  }
  return <Navigate to={`/preview/${roomId}/${role || ""}`} />;
};

function AppRoutes({ getUserToken, appDetails }) {
  return (
    <Router>
      <ToastContainer />
      <Notifications />
      <Confetti />
      <AppData appDetails={appDetails} />
      <KeyboardHandler />
      <Routes>
        <Route
          path="/preview/:roomId/:role"
          element={
            <Suspense fallback={<FullPageProgress />}>
              <PreviewScreen getUserToken={getUserToken} />
            </Suspense>
          }
        />
        <Route
          path="/preview/:roomId/"
          element={
            <Suspense fallback={<FullPageProgress />}>
              <PreviewScreen getUserToken={getUserToken} />
            </Suspense>
          }
        />
        <Route
          path="/meeting/:roomId/:role"
          element={
            <Suspense fallback={<FullPageProgress />}>
              <Conference />
            </Suspense>
          }
        />
        <Route
          path="/meeting/:roomId/"
          element={
            <Suspense fallback={<FullPageProgress />}>
              <Conference />
            </Suspense>
          }
        />
        <Route
          path="/leave/:roomId/:role"
          element={
            <Suspense fallback={<FullPageProgress />}>
              <PostLeave />
            </Suspense>
          }
        />
        <Route
          path="/leave/:roomId/"
          element={
            <Suspense fallback={<FullPageProgress />}>
              <PostLeave />
            </Suspense>
          }
        />
        <Route path="/:roomId/:role" element={<RedirectToPreview />} />
        <Route path="/:roomId/" element={<RedirectToPreview />} />
        <Route
          path="*"
          element={
            <Suspense fallback={<FullPageProgress />}>
              <ErrorPage error="Invalid URL!" />
            </Suspense>
          }
        />
      </Routes>
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
