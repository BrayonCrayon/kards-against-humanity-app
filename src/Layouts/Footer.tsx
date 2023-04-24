import { JoinGameBanner } from "../Components/JoinGameBanner";
import { CreateGameBanner } from "../Components/CreateGameBanner";
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

const Footer: React.FC = () => {
  const location = useLocation();
  const show = useMemo(() => {
    return !location.pathname.includes("/game");
  }, [location.pathname]);

  return (
    <>
      {show ? (
        <div className="w-full flex-initial">
          {location.pathname.includes("/create") ? <CreateGameBanner /> : <JoinGameBanner />}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Footer;
