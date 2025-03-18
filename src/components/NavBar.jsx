import { Link } from "react-router-dom";
import { useState } from "react";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-2 shadow-md w-full">
      <div className="w-full flex justify-around items-center">
        {/* Brand Logo */}
        <div className="text-2xl font-bold">
          <Link to="/" className="hover:text-gray-300">Movie App</Link>
        </div>

        {/* Hamburger Menu (for mobile screens) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="block md:hidden text-gray-300 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Nav Links */}
        <div
          className={`md:flex md:items-center md:space-x-6 space-y-4 md:space-y-0 mt-4 md:mt-0 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <Link
            to="/"
            className="block md:inline-block px-4 py-2 text-lg font-medium hover:text-gray-300"
          >
            Home
          </Link>
          <Link
            to="/favorites"
            className="block md:inline-block px-4 py-2 text-lg font-medium hover:text-gray-300"
          >
            Favorites
          </Link>
        </div>
        <button className="font-serif font-semibold">Login  |  Register</button>
      </div>

    </nav>
  );
}

export default NavBar;
