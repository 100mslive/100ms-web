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

function App() {
  const { 0: width, 1: height } = process.env.REACT_APP_TILE_SHAPE.split(
    "-"
  ).map((el) => parseInt(el));
  return (
    <div className="w-full h-screen dark:bg-black">
      <HMSThemeProvider
        config={{
          theme: {
            extend: {
              fontFamily: {
                sans: [process.env.REACT_APP_FONT, "Inter", "sans-serif"],
                body: [process.env.REACT_APP_FONT, "Inter", "sans-serif"],
              },
              colors: {
                brand: {
                  main: process.env.REACT_APP_COLOR,
                  tint: shadeColor(process.env.REACT_APP_COLOR, 30),
                },
              },
            },
          },
        }}
        appBuilder={{
          theme: process.env.REACT_APP_THEME || "dark",
          enableChat: process.env.REACT_APP_SHOW_CHAT === "true",
          enableScreenShare: process.env.REACT_APP_SHOW_SCREENSHARE === "true",
          logo: process.env.REACT_APP_LOGO,
          videoTileAspectRatio: { width, height },
          showAvatar: process.env.REACT_APP_VIDEO_AVATAR === "true",
          avatarType: "pebble",
        }}
      >
        <HMSRoomProvider>
          <AppContextProvider>
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

export default App;
