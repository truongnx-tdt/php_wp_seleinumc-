import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../constants';
import { hasRole } from '../../utils/auth';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const filteredLinks = NAV_LINKS.filter(link => {
    if (!link.roles) return true;
    return hasRole(link.roles, user);
  });

  return (
    <aside className="bg-green-800 text-white w-64 max-w-full min-h-screen flex flex-col py-4 px-2 sm:py-6 sm:px-4">
      <nav className="flex flex-col gap-1 sm:gap-2">
        {filteredLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-4 py-3 sm:py-2 rounded font-medium transition text-base sm:text-lg ${
                isActive 
                  ? 'bg-green-600 text-white shadow-md' 
                  : 'hover:bg-green-700 text-green-100 hover:text-white'
              }`
            }
            title={link.label}
          >
            {link.label}
            {link.roles && (
              <span className="ml-2 text-xs text-green-300 opacity-75">
                ({link.roles.join(', ')})
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      
      {/* Debug info - chỉ hiển thị trong development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-auto p-4 text-xs text-green-300 border-t border-green-600">
          <div>Debug Info:</div>
          <div>Current User: {user?.name || 'Not logged in'}</div>
          <div>User Role: {user?.role || 'None'}</div>
          <div>Total links: {NAV_LINKS.length}</div>
          <div>Filtered links: {filteredLinks.length}</div>
          <div>Hidden links: {NAV_LINKS.length - filteredLinks.length}</div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar; 