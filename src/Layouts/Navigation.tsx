import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface GameLink {
  path: "/" | "/create";
  text: string;
}

const Navigation: React.FC = () => {

  const location = useLocation();
  const [show, setShow] = useState(false);
  const [link, setLink] = useState<GameLink>({ path: "/create", text: "Create a Game"});

  useEffect(() => {
    setLink({
      path: location.pathname.includes("/create") ? "/" : "/create",
      text: location.pathname.includes("/create") ? "Join a Game" : "Create a Game"
    });
  }, [location.pathname]);

  return (
    <>
    { !location.pathname.includes("/game") &&
      <nav className="flex flex-col w-full py-4 px-2 border-b-2 border-gray-300 shadow-md bg-white">
        <div className="flex justify-between baseline">
          <img src="images/full-logo.png" alt="KAH Logo" className="w-64"/>
          <div className="hidden md:flex">
            <Link to={link.path} className="px-2 font-bold self-end">{ link.text }</Link>
            <Link to="/about-us" className="px-2 ml-4 font-bold self-end">About KAH</Link>
          </div>
          <div onClick={() => setShow(!show)} className="text-4xl flex grow items-center justify-end md:hidden">
            <i className="fa-solid fa-burger mx-2"/>
          </div>
        </div>
        {
          show
            ?
            <div className="flex flex-col gap-4 w-full justify-center border-t border-gray-800 pt-4 md:hidden">
              <Link onClick={() => setShow(!show)} to={link.path} className="font-bold self-center">{ link.text }</Link>
              <Link onClick={() => setShow(!show)} to="/about-us" className="font-bold self-center">About KAH</Link>
            </div>
            : null
        }
      </nav>
    }
    </>
  );
};

export default Navigation;
