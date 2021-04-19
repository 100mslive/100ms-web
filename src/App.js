import { JoinRoom } from "./pages/joinRoom.jsx";

import { Conference } from "./pages/conference.jsx";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AppContextProvider } from "./store/AppContext.js";
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
