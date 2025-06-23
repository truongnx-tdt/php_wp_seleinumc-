import axios from 'axios';
import { toast } from 'react-toastify';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // We don't handle 401 here anymore, the AuthContext will.
    if (error.response?.status === 403) {
      toast.error('Bạn không có quyền truy cập tính năng này.');
    } else if (error.response?.status >= 500) {
      toast.error('Lỗi server. Vui lòng thử lại sau.');
    } 
    // The component that made the call will handle other errors (like 400 or 404)
    // using the rejected promise.
    
    return Promise.reject(error);
  }
);

export default API;
