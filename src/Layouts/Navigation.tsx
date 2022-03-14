import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface GameLink {
  path: '/' | '/create';
  text: string;
}

const Navigation: React.FC = () => {

  const location = useLocation();
  const [link, setLink] = useState<GameLink>({ path: '/create', text: 'Create a Game'});

  useEffect(() => {
    setLink({
      path: location.pathname.includes('/create') ? '/' : '/create',
      text: location.pathname.includes('/create') ? 'Join a Game' : 'Create a Game'
    });
  }, [location.pathname]);

  return (
    <>
    { !location.pathname.includes('/game') &&
      <nav className="flex w-full py-4 px-2 border-b-2 border-gray-300 shadow-md bg-white justify-between baseline">
        <img src="images/full-logo.png" alt="KAH Logo" className='w-64'/>
        <div className="flex">
          <Link to={link.path} className="px-2 font-bold self-end">{ link.text }</Link>
        </div>
      </nav>
    }
    </>
  );
};

export default Navigation;
