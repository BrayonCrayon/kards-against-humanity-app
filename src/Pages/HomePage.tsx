import React from "react";
import { CreateGameForm } from "../Components/Forms/CreateGameForm";
import JoinGameForm from "../Components/Forms/JoinGameForm";

const HomePage: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-y-8 py-4">
      <CreateGameForm />
      <JoinGameForm />
    </div>
  );
};

export default HomePage;
