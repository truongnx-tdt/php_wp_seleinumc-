import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-green-700 text-white shadow-lg relative">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
            <h1 className="text-lg sm:text-xl font-semibold">Nông Sản Admin</h1>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center">
          {user ? (
            <>
              <FaUserCircle className="text-2xl mr-2" />
              <span className="mr-4 font-medium text-sm lg:text-base">
                {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-red-300 hover:text-red-100 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-green-600"
                title="Đăng xuất"
              >
                <FaSignOutAlt className="mr-1" />
                <span className="hidden lg:inline">Đăng xuất</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="font-medium px-3 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
            >
              Đăng nhập
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white hover:text-green-200 transition-colors duration-200 p-2"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-green-800 border-t border-green-600">
          <div className="px-4 py-3 space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 pb-3 border-b border-green-600">
                  <FaUserCircle className="text-2xl" />
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-green-200">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-red-300 hover:text-red-100 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-green-700"
                >
                  <FaSignOutAlt className="mr-2" />
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block font-medium px-3 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 