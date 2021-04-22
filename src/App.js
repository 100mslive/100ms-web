import { JoinRoom } from "./pages/joinRoom.jsx";

import { Conference } from "./pages/conference.jsx";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { AppContext, AppContextProvider } from "./store/AppContext.js";
import { HMSRoomProvider } from '@100mslive/sdk-components';

function App() {
  return (
    <div className="w-full h-screen bg-black">
      <HMSRoomProvider>
        <AppContextProvider>
          <Router>
            <Switch>
              {/* <Route path="/createRoom">
              <CreateRoom />
            </Route> */}

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
    </div>
  );
}

export default App;
