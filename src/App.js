import { JoinRoom } from "./pages/joinRoom.jsx";
import PreviewScreen from "./pages/PreviewScreen";
import { Conference } from "./pages/conference.jsx";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AppContextProvider } from "./store/AppContext.js";
import { HMSRoomProvider, HMSThemeProvider } from "@100mslive/sdk-components";

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
            },
          },
        }}
        appBuilder={{
          theme: process.env.REACT_APP_THEME || "dark",
          enableChat: process.env.REACT_APP_SHOW_CHAT,
          enableScreenShare: process.env.REACT_APP_SHOW_SCREENSHARE,
          logo: process.env.REACT_APP_LOGO,
          videoTileAspectRatio: { width, height },
          showAvatar: process.env.REACT_APP_VIDEO_AVATAR,
        }}
      >
        <HMSRoomProvider>
          <AppContextProvider>
            <Router>
              <Switch>
                {/* <Route path="/createRoom">
              <CreateRoom />
            </Route> */}
                <Route path="/preview">
                  <PreviewScreen />
                </Route>
                <Route path="/meeting">
                  <Conference />
                </Route>
                <Route path="/">
                  <JoinRoom />;
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
