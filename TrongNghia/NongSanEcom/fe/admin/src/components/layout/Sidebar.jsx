import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { NAV_LINKS } from '../../constants';
import { hasRole } from '../../utils/auth';
import { useAuth } from '../../context/AuthContext';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const Sidebar = ({ onLinkClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const filteredLinks = NAV_LINKS.filter(link => {
    if (!link.roles) return true;
    return hasRole(link.roles, user);
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNavLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <aside className="bg-green-800 text-white w-64 flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-green-700">
        <Link to="/" className="flex items-center gap-2" onClick={handleNavLinkClick}>
          <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
          <h1 className="text-xl font-bold">Nông Sản</h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {filteredLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={handleNavLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-colors text-base ${
                isActive 
                  ? 'bg-green-600 text-white shadow-inner' 
                  : 'text-green-100 hover:bg-green-700 hover:text-white'
              }`
            }
          >
            {/* You can add icons here later if you want */}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* User Info & Logout */}
      <div className="p-4 border-t border-green-700">
        {user && (
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-3xl text-green-200" />
            <div className="flex-1">
              <div className="font-semibold text-white">{user.name}</div>
              <div className="text-sm text-green-300 capitalize">{user.role}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-red-300 hover:text-white hover:bg-red-500 rounded-full transition-colors"
              title="Đăng xuất"
            >
              <FaSignOutAlt size={18} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 