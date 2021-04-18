import { Thing } from "@100mslive/sdk-components";
import { Avatar, Header } from "@100mslive/sdk-components";
import { JoinRoom } from "./pages/joinRoom.jsx";
import { CreateRoom } from "./pages/createRoom.jsx";
import { Conference } from "./pages/conference.jsx";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { AppContext, AppContextProvider } from "./store/AppContext.js";
function App() {
  return (
    <div className="w-full h-screen bg-black overflow-hidden">
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
    </div>
  );
}

export default App;
