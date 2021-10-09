import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {


    return (
        <nav className="flex w-full py-4 border-b-2 border-gray-300 shadow-md ">
            <div className="text-4xl w-1/4 self-center font-semibold text-center">
                Kards
            </div>
            <Link to="/" className="text-lg self-end text-black hover:text-gray-600">
                Play
            </Link>
        </nav>
    )
}

export default Navigation;