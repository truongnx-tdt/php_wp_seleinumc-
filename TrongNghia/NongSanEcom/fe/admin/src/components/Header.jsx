import React from 'react';

const Header = ({ onLogout, onMenuClick }) => {
  return (
    <header className="bg-green-700 text-white flex items-center justify-between px-4 sm:px-6 py-3 shadow">
      <div className="flex items-center gap-2">
        <button className="md:hidden mr-2" onClick={onMenuClick} aria-label="Mở menu">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
        <span className="font-bold text-xl">Nông Sản Admin</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-medium hidden sm:block">Admin</span>
        <img src="https://ui-avatars.com/api/?name=Admin" alt="avatar" className="h-8 w-8 rounded-full" />
        <button onClick={onLogout} className="ml-2 sm:ml-4 bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-sm sm:text-base">Đăng xuất</button>
      </div>
    </header>
  );
};

export default Header; 