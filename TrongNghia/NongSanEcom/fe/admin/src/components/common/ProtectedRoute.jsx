import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { clearJwtCookie } from '../../utils/auth';
import { toast } from 'react-toastify';

// Protects routes that require any authenticated user (staff or admin)
export const ProtectedRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  // Nếu đang loading, chờ
  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra thêm: chỉ admin và staff mới được phép
  if (user?.role === 'customer') {
    toast.error('Tài khoản của bạn không có quyền truy cập trang quản trị.');
    clearJwtCookie(); // Clear cookie JWT
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

// Protects routes that require staff or admin access
export const StaffRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  // Nếu đang loading, chờ
  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin' && user?.role !== 'staff') {
    toast.error('Bạn không có quyền truy cập trang này.');
    clearJwtCookie(); // Clear cookie JWT nếu là customer
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

// Protects routes that require an admin user
export const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  // Nếu đang loading, chờ
  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    toast.error('Bạn không có quyền truy cập trang này. Chỉ Admin mới có quyền truy cập.');
    clearJwtCookie(); // Clear cookie JWT nếu không phải admin
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
}; 