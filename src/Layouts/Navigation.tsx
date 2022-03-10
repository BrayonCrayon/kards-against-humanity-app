import React from "react";
import { Link } from "react-router-dom";

const Navigation: React.FC = () => {
  return (
    <nav className="flex w-full py-4 border-b-2 border-gray-300 shadow-md ">
      <div className="text-4xl w-1/2 self-center font-semibold text-center pl-6 md:text-left md:w-1/5">
        Kards
      </div>
      <Link
        to="/"
        className="text-lg self-end text-black hover:text-gray-600 text-center font-semibold w-1/2 md:text-left md:w-auto"
      >
        Games
      </Link>
    </nav>
  );
};

export default Navigation;
