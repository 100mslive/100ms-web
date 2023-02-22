import React from "react";
import { createRoot } from "react-dom/client";
import { init } from "zipyai";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

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
