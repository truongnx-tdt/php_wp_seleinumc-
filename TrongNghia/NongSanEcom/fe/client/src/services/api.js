import axios from 'axios';
import { toast } from 'react-toastify';

// Tạo instance axios cho client
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
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
    
    if (error.response?.status === 401) {
      // Xử lý lỗi authentication
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      // Có thể redirect về trang login
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

// Request interceptor để thêm token nếu có
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

export default API; 