import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../constants';
import { setCurrentUser, removeCurrentUser, clearJwtCookie, getCurrentUser } from '../utils/auth';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // To check auth status on initial load

    const checkAuthStatus = async () => {
        try {
            const response = await API.get(API_ENDPOINTS.AUTH.PROFILE);
            const userData = response.data;
            
            // Kiểm tra role khi reload trang
            if (userData.role === 'customer') {
                toast.error('Tài khoản của bạn không có quyền truy cập trang quản trị.');
                setUser(null);
                removeCurrentUser();
                clearJwtCookie(); // Clear cookie JWT
                // Redirect về trang login và dừng loading
                setLoading(false);
                window.location.href = '/login';
                return;
            }
            
            setUser(userData);
            setCurrentUser(userData); // Lưu vào localStorage để đồng bộ
        } catch (error) {
            // Xử lý khi API trả về 401 (cookie hết hạn hoặc không hợp lệ)
            if (error.response?.status === 401) {
                console.log('Session expired or invalid, redirecting to login');
                setUser(null);
                removeCurrentUser();
                clearJwtCookie();
                
                // Chỉ redirect nếu không đang ở trang login
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            } else {
                // Các lỗi khác
                setUser(null);
                removeCurrentUser();
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Kiểm tra xem có đang ở trang login không
        const isLoginPage = window.location.pathname === '/login';
        
        // Nếu đang ở trang login, chỉ load user từ localStorage
        if (isLoginPage) {
            const localUser = getCurrentUser();
            if (localUser) {
                setUser(localUser);
            }
            setLoading(false);
            return;
        }

        // Chỉ kiểm tra auth status khi không ở trang login
        checkAuthStatus();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await API.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
            
            // Kiểm tra role ngay sau khi đăng nhập thành công
            if (data.role === 'customer') {
                toast.error('Tài khoản của bạn không có quyền truy cập trang quản trị.');
                
                // Clear tất cả dữ liệu ngay lập tức
                clearJwtCookie();
                removeCurrentUser();
                setUser(null);
                
                // Gọi logout API để clear session trên server (không cần await)
                API.post(API_ENDPOINTS.AUTH.LOGOUT).catch(() => {
                    // Ignore logout error
                });
                
                return false;
            }
            
            // Nếu là admin hoặc staff, lưu thông tin user
            setUser(data);
            setCurrentUser(data);
            toast.success('Đăng nhập thành công!');
            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Email hoặc mật khẩu không chính xác';
            toast.error(errorMessage);
            
            // Clear dữ liệu nếu có lỗi
            setUser(null);
            removeCurrentUser();
            clearJwtCookie();
            
            return false;
        }
    };

    const logout = async () => {
        try {
            await API.post(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            // Ignore logout error
        } finally {
            // Luôn clear dữ liệu local
            setUser(null);
            removeCurrentUser();
            clearJwtCookie();
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isStaff: user?.role === 'staff',
        login,
        logout,
        loading,
    };

    // Show a loading spinner while checking auth status
    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
}; 