import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/axiosInstance';
import { API_ENDPOINTS, STORAGE_KEYS, USER_ROLES } from '../constants';
import { setCurrentUser } from '../utils/auth';
import Button from '../components/common/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // show and hidden password
  const [showPassword, setShowPassword] = useState(false);
  const passwordType = showPassword ? 'text' : 'password';
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post(API_ENDPOINTS.AUTH.LOGIN, formData);
      const data = response.data;

      if (data.data.role === USER_ROLES.CUSTOMER) {
        toast.error('Bạn không có quyền truy cập trang quản trị');
        return;
      }

      setCurrentUser(data.data);
      toast.success(data.message);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại!';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
            type={passwordType}
            name="password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-2/3 transform -translate-y-1/2">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="mb-4">
          <label className="mb-1 flex">Quên mật khẩu liên hệ:<a href="mailto:admin@support.com" className="text-blue-500">admin@support.com</a></label>
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