import React, {useEffect} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {CreateGamePage} from "./Pages/CreateGamePage";
import Game from "./Pages/Game";
import {apiClient} from "./api/apiClient";

export default function App() {

  useEffect(() => {
    apiClient
        .get(`/sanctum/csrf-cookie`)
        .catch(error => {
          console.error(error);
        });
  });

  return (
      <Router >
        <div className="h-screen">
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/game">
              <Game />
            </Route>

            <Route path="/">
              <CreateGamePage />
            </Route>

          </Switch>
        </div>
      </Router>
  );
}
