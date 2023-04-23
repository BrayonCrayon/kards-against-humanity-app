import { JoinGameBanner } from "../Components/JoinGameBanner";
import { CreateGameBanner } from "../Components/CreateGameBanner";
import React from "react";
import { useLocation } from "react-router-dom";

const Footer: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-full flex-initial">
      {location.pathname.includes("/create") ? <CreateGameBanner /> : <JoinGameBanner />}
    </div>
  );
};

export default Footer;
