import { useState } from "react";
import { Link } from "react-router-dom"; 

function NavBar() {
const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 backdrop-blur-lg bg-opacity-80 text-white shadow-2xl w-full border-b border-white/20">
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Brand Logo */}
          <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM4 8a1 1 0 000 2h1v3a1 1 0 001 1h4a1 1 0 001-1v-3h1a1 1 0 100-2H4z" />
                </svg>
              </div>
              <span className="hidden sm:block">AbbottCinima</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="relative px-4 py-2 text-lg font-medium transition-all duration-300 hover:text-cyan-300 group"
            >
              <span className="relative z-10">Home</span>
              <div className="absolute inset-0 bg-white/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 backdrop-blur-sm"></div>
            </Link>
            <Link
              to="/favorites"
              className="relative px-4 py-2 text-lg font-medium transition-all duration-300 hover:text-pink-300 group"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>Favorites</span>
              </span>
              <div className="absolute inset-0 bg-white/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 backdrop-blur-sm"></div>
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <button className="px-6 py-2 text-sm font-semibold text-white/90 hover:text-white transition-colors duration-300 border border-white/30 rounded-full hover:border-cyan-400/50 backdrop-blur-sm">
              Login
            </button>
            <button className="px-6 py-2 text-sm font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25">
              Register
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-4 border border-white/20">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-lg font-medium hover:bg-white/10 rounded-xl transition-all duration-300 hover:text-cyan-300"
            >
              Home
            </Link>
            <Link
              to="/favorites"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-lg font-medium hover:bg-white/10 rounded-xl transition-all duration-300 hover:text-pink-300"
            >
              ❤️ Favorites
            </Link>
            <div className="pt-4 border-t border-white/20 space-y-3">
              <button className="w-full px-4 py-3 text-sm font-semibold text-white/90 border border-white/30 rounded-xl hover:border-cyan-400/50 transition-colors duration-300">
                Login
              </button>
              <button className="w-full px-4 py-3 text-sm font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-xl transition-all duration-300 transform hover:scale-105">
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
