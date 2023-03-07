import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GamePage from "./Pages/GamePage";
import Navigation from "./Layouts/Navigation";
import Footer from "./Layouts/Footer";
import HomePage from "./Pages/HomePage";
import { apiClient } from "./Api/apiClient";
import { SpectatorPage } from "Pages/SpectatorPage";
import { CreateGameForm } from "Components/Forms/CreateGameForm";

export default function App() {
  useEffect(() => {
    apiClient.get(`/sanctum/csrf-cookie`).catch((error) => {
      console.error(error);
    });
  });

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation />

        <div className="flex-1">
          <Switch>
            <Route path="/game/:id/spectate">
              <SpectatorPage />
            </Route>

            <Route path="/game/:id">
              <GamePage />
            </Route>

            <Route path="/create">
              <CreateGameForm />
            </Route>

            <Route exact path="/">
              <HomePage />
            </Route>

            <Route exact path="/:code">
              <HomePage />
            </Route>
          </Switch>
        </div>

        <Footer />
      </div>
    </Router>
  );
}
