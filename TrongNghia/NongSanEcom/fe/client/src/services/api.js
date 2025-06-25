import axios from 'axios';
import { toast } from 'react-toastify';

// Tạo instance axios cho client
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true, // Gửi cookies
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Debug logging
console.log('API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000');

// Response interceptor để xử lý lỗi
API.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.message);
    
    // Nếu lỗi 401 (Unauthorized) - cookie đã hết hạn
    if (error.response?.status === 401) {
      // Xóa user khỏi localStorage và redirect về login
      localStorage.removeItem('user');
      
      // Chỉ redirect nếu không phải đang ở trang login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
    } else if (error.response?.status === 403) {
      toast.error('Bạn không có quyền truy cập tính năng này.');
    } else if (error.response?.status >= 500) {
      toast.error('Lỗi server. Vui lòng thử lại sau.');
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Kết nối timeout. Vui lòng thử lại.');
    } else if (error.code === 'ERR_NETWORK') {
      toast.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    } else {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
    
    return Promise.reject(error);
  }
);

// Request interceptor - không cần thêm token vì đã dùng cookie
API.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

export default API; 