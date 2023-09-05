import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GamePage from "./Pages/GamePage";
import HomePage from "./Pages/HomePage";
import { apiClient } from "Api/apiClient";
import { SpectatorPage } from "Pages/SpectatorPage";
import { CreateGameForm } from "Components/Forms/CreateGameForm";
import Navigation from "Layouts/Navigation";
import Footer from "Layouts/Footer";

export default function App() {
  useEffect(() => {
    apiClient.get("/sanctum/csrf-cookie").catch((error) => {
      console.error(error);
    });
  });

  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col">
        <Navigation />

        <div className="flex-1">
          <Routes>
            <Route path="/game/:id/spectate" element={<SpectatorPage />} />
            <Route path="/game/:id" element={<GamePage />} />
            <Route path="/create" element={<CreateGameForm />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/:code" element={<HomePage />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
