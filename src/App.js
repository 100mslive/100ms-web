import { JoinRoom } from "./pages/joinRoom.jsx";
import PreviewScreen from "./pages/PreviewScreen";
import { Conference } from "./pages/conference.jsx";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { AppContext, AppContextProvider } from "./store/AppContext.js";
import { HMSRoomProvider, HMSThemeProvider } from "@100mslive/sdk-components";

function App() {
  return (
    <div className="w-full h-screen dark:bg-black">
      <HMSThemeProvider
        theme={{}}
        appBuilder={{
          theme: "light",
          // enableChat: false,
          // enableScreenShare: false,
          logo: "https://blog.hubspot.com/hubfs/image8-2.jpg",
          videoTileAspectRatio: {
            width: 1,
            height: 1,
          },
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
