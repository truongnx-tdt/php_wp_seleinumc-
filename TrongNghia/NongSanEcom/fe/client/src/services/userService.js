import API from './api';

// User API endpoints
const USER_ENDPOINTS = {
  PROFILE: '/api/users/profile',
  CHANGE_PASSWORD: '/api/users/change-password',
  ADDRESSES: '/api/users/profile/addresses',
  ADDRESS: (addressId) => `/api/users/profile/addresses/${addressId}`,
  SET_DEFAULT_ADDRESS: (addressId) => `/api/users/profile/addresses/${addressId}/default`,
};

export const userService = {
  // Cập nhật profile
  updateProfile: async (profileData) => {
    const response = await API.put(USER_ENDPOINTS.PROFILE, profileData);
    return response.data;
  },

  // Đổi mật khẩu
  changePassword: async (passwordData) => {
    const response = await API.put(USER_ENDPOINTS.CHANGE_PASSWORD, passwordData);
    return response.data;
  },

  // Lấy danh sách địa chỉ
  getAddresses: async () => {
    const response = await API.get(USER_ENDPOINTS.ADDRESSES);
    return response.data;
  },

  // Thêm địa chỉ mới
  addAddress: async (addressData) => {
    const response = await API.post(USER_ENDPOINTS.ADDRESSES, addressData);
    return response.data;
  },

  // Cập nhật địa chỉ
  updateAddress: async (addressId, addressData) => {
    const response = await API.put(USER_ENDPOINTS.ADDRESS(addressId), addressData);
    return response.data;
  },

  // Xóa địa chỉ
  deleteAddress: async (addressId) => {
    const response = await API.delete(USER_ENDPOINTS.ADDRESS(addressId));
    return response.data;
  },

  // Đặt địa chỉ mặc định
  setDefaultAddress: async (addressId) => {
    const response = await API.put(USER_ENDPOINTS.SET_DEFAULT_ADDRESS(addressId));
    return response.data;
  },
};

export default userService; 