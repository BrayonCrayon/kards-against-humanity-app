import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import GamePage from "./Pages/GamePage";
import Navigation from "./Layouts/Navigation";
import HomePage from "./Pages/HomePage";

export default function App() {
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
