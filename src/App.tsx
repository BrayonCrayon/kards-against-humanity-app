import React, { useCallback, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import GamePage from "./Pages/GamePage";
import { apiClient } from "./Api/apiClient";
import Navigation from "./Layouts/Navigation";
import HomePage from "./Pages/HomePage";
import Echo from "laravel-echo";

export default function App() {
  const testingSockets = useCallback(async () => {
    await apiClient.get(`/sanctum/csrf-cookie`);

    // @ts-ignore
    window.Echo = new Echo({
      broadcaster: "pusher",
      key: "80e06980f526e21fc058",
      cluster: "us2",
      forceTLS: true,
      authorizer: (channel: any, options: any) => {
        return {
          authorize: (socketId: any, callback: any) => {
            apiClient
              .post(`/api/broadcasting/auth`, {
                socket_id: socketId,
                channel_name: channel.name,
              })
              .then((response) => {
                callback(false, response.data);
              })
              .catch((error) => {
                callback(true, error);
              });
          },
        };
      },
    });

    // @ts-ignore
    window.Echo.private("gametest").listenToAll((event, data) => {
      console.log(event, data);
    });
    //echo.connect();
    // @ts-ignore
    window.Echo.private("gametest").listen(".game.joined", () => {
      // do what you need to do based on the event name and data
      console.log("Heard an event");
    });
  }, []);

  useEffect(() => {
    testingSockets();
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
