import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import GameContextProvider from "./State/Game/GameContextProvider";

import Echo from "laravel-echo";

// @ts-ignore
window.Pusher = require("pusher-js");

// @ts-ignore
window.Echo = new Echo({
  broadcaster: "pusher",
  key: "80e06980f526e21fc058",
  cluster: "us2",
  forceTLS: true,
  authEndpoint: "http://localhost:8080/broadcasting/auth",
});

//echo.connect();
// @ts-ignore
window.Echo.private("private-game.test").listen("GameJoined", () => {
  console.log("Heard an event");
});

ReactDOM.render(
  <React.StrictMode>
    <GameContextProvider>
      <App />
    </GameContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
