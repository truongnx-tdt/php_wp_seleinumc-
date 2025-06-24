import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import useSettings from '../hooks/useSettings';
import { PageHeader, Button } from '../components/common';
import SystemStats from '../components/settings/SystemStats';
import RecentActivities from '../components/settings/RecentActivities';
import SecurityInfo from '../components/settings/SecurityInfo';
import SystemInfo from '../components/settings/SystemInfo';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const {
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
  } = useSettings();

  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      initializeProfileData(user);
    }
  }, [user, initializeProfileData]);

  useEffect(() => {
    // Chỉ gọi API khi user là admin và chưa load settings
    if (user?.role === 'admin' && !settingsLoaded) {
      loadSystemSettings();
    }
  }, [user?.role, loadSystemSettings, settingsLoaded]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Reset settings when component unmounts
      resetSettings();
    };
  }, [resetSettings]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateProfile(profileData);
      if (updatedUser) {
        updateUser(updatedUser);
      }
    } catch (err) {
      // Error handled in hook
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      // new password and confirm password must be the same and min 8 characters, digits, uppercase and lowercase letters, special characters
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(passwordData.newPassword)) {
        toast.error('Mật khẩu không hợp lệ: Mật khẩu phải có ít nhất 8 ký tự, chữ hoa, chữ thường, số và ký tự đặc biệt');
        return;
      }
      await changePassword(passwordData);
    } catch (err) {
      // Error handled in hook
    }
  };

  const tabs = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: '👤' },
    { id: 'password', label: 'Đổi mật khẩu', icon: '🔒' },
    ...(user?.role === 'admin' ? [{ id: 'system', label: 'Hệ thống', icon: '⚙️' }] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Cài đặt"
        subtitle="Quản lý thông tin tài khoản và cài đặt hệ thống"
      />

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>
                <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ tên
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading.profile}
                    className="w-full"
                  >
                    Cập nhật thông tin
                  </Button>
                </form>

                {/* User Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Thông tin tài khoản</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Vai trò</p>
                      <p className="font-medium">
                        {user?.role === 'admin' ? 'Quản trị viên' :
                          user?.role === 'staff' ? 'Nhân viên' : 'Khách hàng'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ngày tham gia</p>
                      <p className="font-medium">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <SecurityInfo />
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Đổi mật khẩu</h3>
                <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                      minLength={8}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                      minLength={8}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="secondary"
                    loading={loading.password}
                    className="w-full"
                  >
                    Đổi mật khẩu
                  </Button>
                </form>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Lưu ý bảo mật</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Mật khẩu phải có ít nhất 8 ký tự</li>
                    <li>• Nên sử dụng kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                    <li>• Không chia sẻ mật khẩu với người khác</li>
                    <li>• Thay đổi mật khẩu định kỳ để bảo mật</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <SecurityInfo />
            </div>
          </div>
        )}

        {/* System Tab (Admin only) */}
        {activeTab === 'system' && user?.role === 'admin' && (
          <div className="space-y-6">
            {/* System Statistics */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Thống kê hệ thống</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshSettings}
                loading={loading.settings}
                className="flex items-center space-x-2"
              >
                <span>🔄</span>
                <span>Làm mới</span>
              </Button>
            </div>

            <SystemStats
              statistics={systemSettings.statistics}
              loading={loading.settings}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <RecentActivities
                activities={systemSettings.recentActivities}
                loading={loading.settings}
              />

              {/* System Info */}
              <SystemInfo />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings; 