import { Thing } from "@100mslive/sdk-components";
import { Avatar, Header } from "@100mslive/sdk-components";
import { JoinRoom } from "./pages/joinRoom.jsx";
import { CreateRoom } from "./pages/createRoom.jsx";
import { Conference } from "./pages/conference.jsx";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { AppContext, AppContextProvider } from "./store/AppContext.js";
function App() {
  return (
    <div class="w-full h-screen bg-black">
      <AppContextProvider>
        <Router>
          <Switch>
            {/* <Route path="/createRoom">
              <CreateRoom />
            </Route> */}

            <Route path="/meeting">
              <AppContext.Consumer>
                {(context) => {
                  return (
                    <Conference
                      streams={context.streams}
                      loginInfo={context.loginInfo}
                    />
                  );
                }}
              </AppContext.Consumer>
            </Route>
            <Route path="/">
              <AppContext.Consumer>
                {(context) => {
                  return <JoinRoom setLoginInfo={context.setLoginInfo} />;
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
