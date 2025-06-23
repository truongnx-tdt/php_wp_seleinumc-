import { STORAGE_KEYS, USER_ROLES } from '../constants';

// token store in cookie
export const getToken = () => {
  return document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
};

// Clear JWT cookie
export const clearJwtCookie = () => {
  document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

// Lưu ý: getCurrentUser() và setCurrentUser() chỉ dùng cho backward compatibility
// Nên sử dụng AuthContext thay thế
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

export const setCurrentUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(user));
};

export const removeCurrentUser = () => {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
};

export const isAuthenticated = () => {
  const user = getCurrentUser();
  return !!user;
};

// Cập nhật hàm hasRole để nhận user từ parameter thay vì đọc từ localStorage
export const hasRole = (requiredRoles, user = null) => {
  // Nếu không có user parameter, thử đọc từ localStorage (backward compatibility)
  const currentUser = user || getCurrentUser();
  
  if (!currentUser) return false;

  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(currentUser.role);
  }

  return currentUser.role === requiredRoles;
};

export const isAdmin = (user = null) => {
  return hasRole(USER_ROLES.ADMIN, user);
};

export const isStaff = (user = null) => {
  return hasRole([USER_ROLES.ADMIN, USER_ROLES.STAFF], user);
};

export const logout = () => {
  removeCurrentUser();
  clearJwtCookie();
  window.location.href = '/login';
}; 