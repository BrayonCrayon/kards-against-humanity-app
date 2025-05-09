import React from "react";
import "@/index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { PlayersProvider } from "@/State/Players/PlayersContext";
import { HandProvider } from "@/State/Hand/HandContext";
import { AuthProvider } from "@/State/Auth/AuthContext";
import { GameProvider } from "@/State/Game/GameContext";
import { createRoot } from "react-dom/client";
import { SpectateProvider } from "@/State/Spectate/SpectateContext";
import { VoteProvider } from "@/State/Vote/VoteContext";
import { NotificationsProvider } from "@/State/Notifications/NotificationsContext";

const container = document.getElementById("root");

if (!container) throw Error("Cannot have empty container.");

const root = createRoot(container);

root.render(
  // <React.StrictMode>
  <AuthProvider>
    <HandProvider>
      <PlayersProvider>
        <GameProvider>
          <VoteProvider>
            <SpectateProvider>
              <NotificationsProvider>
                <App />
              </NotificationsProvider>
            </SpectateProvider>
          </VoteProvider>
        </GameProvider>
      </PlayersProvider>
    </HandProvider>
  </AuthProvider>,
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
