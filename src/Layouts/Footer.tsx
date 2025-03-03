import { JoinGameBanner } from "@/Components/JoinGameBanner";
import CreateGameBanner from "@/Components/CreateGameBanner";
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

const Footer: React.FC = () => {
  const location = useLocation();
  const show = useMemo(() => {
    return !location.pathname.includes("/game");
  }, [location.pathname]);

  const showAboutUs = useMemo(() => {
    return location.pathname.includes("/about-us");
  }, [location.pathname]);

  if(showAboutUs){
    return(
      <>
        <div className="w-full h-80">
          <div className="w-full bg-footer-adjacent-pattern bg-cover bg-center h-80 "></div>
        </div>
      </>)
  }

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
