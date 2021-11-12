import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CreateGameForm } from "./Components/Forms/CreateGameForm";
import GamePage from "./Pages/GamePage";
import { apiClient } from "./Api/apiClient";
import Navigation from "./Layouts/Navigation";
import HomePage from "./Pages/HomePage";

export default function App() {
  useEffect(() => {
    apiClient.get(`/sanctum/csrf-cookie`).catch((error) => {
      console.error(error);
    });
  });

  return (
    <Router>
      <div className="h-screen ">
        <Navigation />

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/game/:id">
            <GamePage />
          </Route>

          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
