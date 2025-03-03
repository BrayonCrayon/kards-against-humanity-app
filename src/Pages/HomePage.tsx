import React from "react";
import JoinGameForm from "@/Components/Forms/JoinGameForm";

const HomePage: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-y-8">
      <JoinGameForm />
    </div>
  );
};

export default HomePage;
