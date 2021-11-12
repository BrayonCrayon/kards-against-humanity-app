import React from "react";
import { CreateGamePage } from "./CreateGamePage";
import JoinGameSection from "../Components/JoinGameSection";

const HomePage: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-y-8 py-4">
      <CreateGamePage />
      <JoinGameSection />
    </div>
  );
};

export default HomePage;
