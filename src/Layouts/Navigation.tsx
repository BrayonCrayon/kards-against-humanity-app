import React from "react";

const Navigation: React.FC = () => {
  return (
    <nav className="flex w-full py-4 px-2 border-b-2 border-gray-300 shadow-md bg-white justify-between baseline">
      <img src="images/full-logo.png" alt="KAH Logo" className='w-64'/>
      <i className="fa-solid fa-burger text-4xl self-end"></i>
    </nav>
  );
};

export default Navigation;
