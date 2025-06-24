import API from './api';

// Auth API endpoints
const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  PROFILE: '/api/auth/profile',
  REFRESH: '/api/auth/refresh',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  VERIFY_EMAIL: '/api/auth/verify-email',
};

export const authService = {
  // Đăng nhập
  login: async (credentials) => {
    const response = await API.post(AUTH_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  // Đăng ký
  register: async (userData) => {
    const response = await API.post(AUTH_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  // Đăng xuất
  logout: async () => {
    try {
      await API.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Xóa token khỏi localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Lấy thông tin profile
  getProfile: async () => {
    const response = await API.get(AUTH_ENDPOINTS.PROFILE);
    return response.data;
  },

  // Cập nhật profile
  updateProfile: async (profileData) => {
    const response = await API.put(AUTH_ENDPOINTS.PROFILE, profileData);
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await API.post(AUTH_ENDPOINTS.REFRESH);
    return response.data;
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    const response = await API.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    return response.data;
  },

  // Reset mật khẩu
  resetPassword: async (token, newPassword) => {
    const response = await API.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
      token,
      password: newPassword,
    });
    return response.data;
  },

  // Xác thực email
  verifyEmail: async (token) => {
    const response = await API.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { token });
    return response.data;
  },

  // Kiểm tra trạng thái đăng nhập
  checkAuthStatus: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        return {
          isAuthenticated: true,
          user: JSON.parse(user),
          token,
        };
      } catch (error) {
        console.error('Error parsing user data:', error);
        return { isAuthenticated: false };
      }
    }
    
    return { isAuthenticated: false };
  },

  // Lưu thông tin đăng nhập
  saveAuthData: (data) => {
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  },

  // Xóa thông tin đăng nhập
  clearAuthData: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService; 