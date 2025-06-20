import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    toast.success('Đăng xuất thành công!');
    navigate('/login');
  };
  return (
    <div className="flex flex-col min-h-screen">
      <Header onLogout={handleLogout} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        {/* Sidebar: ẩn trên mobile, hiện trên md+ */}
        <div className={`fixed inset-0 z-40 bg-black bg-opacity-30 md:bg-transparent md:static md:z-auto transition-all ${sidebarOpen ? 'block' : 'hidden'} md:block`} onClick={() => setSidebarOpen(false)} />
        <div className={`fixed z-50 md:static md:z-auto transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <Sidebar />
        </div>
        <main className="flex-1 bg-gray-50 p-2 sm:p-4 md:p-6 transition-all">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 