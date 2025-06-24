import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { API_ENDPOINTS } from '../constants';
import { toast } from 'react-toastify';

const useSettings = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [systemSettings, setSystemSettings] = useState({
    statistics: {},
    recentActivities: {},
  });
  
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    settings: false,
  });
  
  const { get, put } = useApi();

  // Load system settings
  const loadSystemSettings = useCallback(async () => {
    if (settingsLoaded) {
      console.log('Settings already loaded, skipping...');
      return; // Tránh gọi lại nếu đã load
    }
    
    console.log('Loading system settings...');
    setLoading(prev => ({ ...prev, settings: true }));
    try {
      const data = await get(API_ENDPOINTS.USERS.SETTINGS);
      setSystemSettings(data);
      setSettingsLoaded(true);
      console.log('System settings loaded successfully');
    } catch (err) {
      console.error('Error loading system settings:', err);
      toast.error('Không thể tải thông tin hệ thống');
    } finally {
      setLoading(prev => ({ ...prev, settings: false }));
    }
  }, [get, settingsLoaded]);

  // Refresh system settings (force reload)
  const refreshSettings = useCallback(async () => {
    setLoading(prev => ({ ...prev, settings: true }));
    try {
      const data = await get(API_ENDPOINTS.USERS.SETTINGS);
      setSystemSettings(data);
      setSettingsLoaded(true);
    } catch (err) {
      toast.error('Không thể tải thông tin hệ thống');
    } finally {
      setLoading(prev => ({ ...prev, settings: false }));
    }
  }, [get]);

  // Update profile
  const updateProfile = useCallback(async (data) => {
    setLoading(prev => ({ ...prev, profile: true }));
    try {
      const response = await put(API_ENDPOINTS.USERS.PROFILE, data);
      toast.success('Cập nhật thông tin thành công!');
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Cập nhật thông tin thất bại!';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  }, [put]);

  // Change password
  const changePassword = useCallback(async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }
    
    setLoading(prev => ({ ...prev, password: true }));
    try {
      await put(API_ENDPOINTS.USERS.CHANGE_PASSWORD, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Đổi mật khẩu thành công!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Đổi mật khẩu thất bại!';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  }, [put]);

  // Initialize profile data
  const initializeProfileData = useCallback((user) => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, []);

  // Reset settings (for cleanup)
  const resetSettings = useCallback(() => {
    setSystemSettings({
      statistics: {},
      recentActivities: {},
    });
    setSettingsLoaded(false);
  }, []);

  return {
    profileData,
    setProfileData,
    passwordData,
    setPasswordData,
    systemSettings,
    settingsLoaded,
    loading,
    updateProfile,
    changePassword,
    loadSystemSettings,
    refreshSettings,
    initializeProfileData,
    resetSettings,
  };
};

export default useSettings; 