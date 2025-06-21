import { STORAGE_KEYS, USER_ROLES } from '../constants';

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
  return !!user?.token;
};

export const hasRole = (requiredRoles) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(user.role);
  }
  
  return user.role === requiredRoles;
};

export const isAdmin = () => {
  return hasRole(USER_ROLES.ADMIN);
};

export const isStaff = () => {
  return hasRole([USER_ROLES.ADMIN, USER_ROLES.STAFF]);
};

export const logout = () => {
  removeCurrentUser();
  window.location.href = '/login';
}; 