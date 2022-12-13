import React from "react";
import { createRoot } from "react-dom/client";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { init } from "zipyai";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

if (
  process.env.NODE_ENV === "production" &&
  process.env.REACT_APP_LOGROCKET_ID
) {
  LogRocket.init(process.env.REACT_APP_LOGROCKET_ID);
  setupLogRocketReact(LogRocket);
}

if (process.env.REACT_APP_ZIPY_KEY) {
  init(process.env.REACT_APP_ZIPY_KEY);
}

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
