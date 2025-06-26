import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // If user is already authenticated, redirect to appropriate page
  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(formData.email, formData.password);
    if (success) {
      // Redirect logic is handled in useEffect above
    }
    setLoading(false);
  };

  // Nếu đang loading auth, hiển thị loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/images/Che-bien-nong-san-la-gi.jpg')] bg-cover bg-center">
        <div className="bg-white p-8 rounded shadow-md">
          <div className="text-center">Đang kiểm tra...</div>
        </div>
      </div>
    );
  }

  // Nếu đã đăng nhập, hiển thị loading trong khi redirect
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/images/Che-bien-nong-san-la-gi.jpg')] bg-cover bg-center">
        <div className="bg-white p-8 rounded shadow-md">
          <div className="text-center">Đang chuyển hướng...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/Che-bien-nong-san-la-gi.jpg')] bg-cover bg-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Quản lý bán hàng</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.email}
            onChange={handleChange}
            required
            autoFocus
          />
        </div>

        <div className="mb-6 relative">
          <label className="block mb-1 font-medium">Mật khẩu</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2/3 transform -translate-y-1/2">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="mb-4">
          <label className="mb-1 flex">Quên mật khẩu? Liên hệ: <a href="mailto:admin@support.com" className="text-blue-500 ml-1">admin@support.com</a></label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </form>
    </div>
  );
};

export default Login; 