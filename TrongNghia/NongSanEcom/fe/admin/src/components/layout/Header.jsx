import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars } from 'react-icons/fa';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white text-gray-800 shadow-sm flex items-center justify-between px-4 sm:px-6 py-3 z-10">
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={onMenuClick}
          className="text-gray-600 hover:text-green-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Open sidebar"
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Logo and Title - always visible but centered on mobile */}
      <div className="flex-1 flex justify-center md:justify-start">
        <Link to="/" className="items-center gap-2 text-green-700 flex sm:hidden">
          <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
          <h1 className="text-lg sm:text-xl font-semibold">
            Nông Sản Admin
          </h1>
        </Link>
      </div>

      {/* User Info on Desktop */}
      <div className="hidden md:flex items-center">
        {user && (
          <div className="text-right">
            <div className="font-semibold">{user.name}</div>
            <div className="text-xs text-gray-500 capitalize">{user.role}</div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 