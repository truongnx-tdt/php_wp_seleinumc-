import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem('adminUser'));
  const userRole = user?.role;

  const allLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/users', label: 'Quản trị người dùng' },
    { to: '/orders', label: 'Đơn hàng' },
    { to: '/products', label: 'Sản phẩm' },
    { to: '/settings', label: 'Cài đặt' },
  ];

  const links = userRole === 'admin' 
    ? allLinks
    : allLinks.filter(l => l.to === '/orders' || l.to === '/products');

  return (
    <aside className="bg-green-800 text-white w-64 max-w-full min-h-screen flex flex-col py-4 px-2 sm:py-6 sm:px-4">
      <nav className="flex flex-col gap-1 sm:gap-2">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-4 py-3 sm:py-2 rounded font-medium transition text-base sm:text-lg ${isActive ? 'bg-green-600' : 'hover:bg-green-700'}`
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