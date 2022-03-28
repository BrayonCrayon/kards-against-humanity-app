import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import GameContextProvider from "./State/Game/GameContextProvider";
import { VoteProvider } from "./State/Vote/VoteContext";
import { UsersProvider } from "./State/Users/UsersContext";
import { HandProvider } from "./State/Hand/HandContext";

ReactDOM.render(
  <React.StrictMode>
    <HandProvider>
      <UsersProvider>
        <GameContextProvider>
          <VoteProvider>
            <App />
          </VoteProvider>
        </GameContextProvider>
      </UsersProvider>
    </HandProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
