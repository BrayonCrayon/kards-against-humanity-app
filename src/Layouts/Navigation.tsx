import React from "react";
import { useGame } from "State/Game/useGame";

const Navigation: React.FC = () => {

  const {state} = useGame();

  return (
    <>
    { !state.game.id &&
      <nav className="flex w-full py-4 px-2 border-b-2 border-gray-300 shadow-md bg-white justify-between baseline">
        <img src="images/full-logo.png" alt="KAH Logo" className='w-64'/>
        <i className="fa-solid fa-burger text-4xl self-end"></i>
      </nav>
    }
    </>
  );
};

export default Navigation;
