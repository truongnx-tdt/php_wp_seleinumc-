import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../constants';
import { hasRole } from '../../utils/auth';

const Sidebar = () => {
  const filteredLinks = NAV_LINKS.filter(link => {
    if (!link.roles) return true;
    return hasRole(link.roles);
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
                isActive ? 'bg-green-600' : 'hover:bg-green-700'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 