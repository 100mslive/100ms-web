import { Thing } from "@100mslive/sdk-components";
import { Avatar, Header } from "@100mslive/sdk-components";
import { JoinRoom } from "./pages/joinRoom.jsx";
import { CreateRoom } from "./pages/createRoom.jsx";
import { Conference } from "./pages/conference.jsx";

import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import { AppContext, AppContextProvider } from "./store/AppContext.js";
function App() {
  return (
    <div className="w-full h-screen bg-black">
      <AppContextProvider>
        <Router>
          <Switch>
            <Route path="/createRoom">
              <CreateRoom />
            </Route>
            <Route path="/joinRoom">
              <JoinRoom />
            </Route>
            <Route path="/meeting">
              <AppContext.Consumer>
                {(context) => {
                  console.log(context);
                  return (
                    <Conference streamsWithInfo={context.streamsWithInfo} />
                  );
                }}
              </AppContext.Consumer>
            </Route>
          </Switch>
        </Router>
      </AppContextProvider>
    </div>
  );
}

export default App;
