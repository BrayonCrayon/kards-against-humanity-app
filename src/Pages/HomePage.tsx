import React from "react";
import { CreateGameForm } from "../Components/Forms/CreateGameForm";
import JoinGameForm from "../Components/Forms/JoinGameForm";
import Alert from "../Components/Alerts/Alert";

const HomePage: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-y-8 py-4 md:grid-cols-2">
      <Alert alert={{ type: "info", text: "Hello please" }} id={1} />

      <CreateGameForm />
      <JoinGameForm />
    </div>
  );
};

export default HomePage;
