// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
  },
  PRODUCTS: {
    LIST: '/api/products',
    CREATE: '/api/products',
    UPDATE: (id) => `/api/products/${id}`,
    DELETE: (id) => `/api/products/${id}/delete`,
    DETAIL: (id) => `/api/products/${id}`,
  },
  USERS: {
    LIST: '/api/auth/get-users',
    CREATE: '/api/auth/add-user',
    UPDATE: (id) => `/api/auth/${id}`,
    DELETE: (id) => `/api/auth/${id}`,
  },
  ORDERS: {
    LIST: '/api/orders',
    DETAIL: (id) => `/api/orders/${id}`,
    UPDATE_STATUS: (id) => `/api/orders/${id}/status`,
  },
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  CUSTOMER: 'customer',
};

// Navigation Links
export const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/users', label: 'Quản trị người dùng', icon: 'users', roles: [USER_ROLES.ADMIN] },
  { to: '/orders', label: 'Đơn hàng', icon: 'orders' },
  { to: '/products', label: 'Sản phẩm', icon: 'products' },
  { to: '/settings', label: 'Cài đặt', icon: 'settings' },
];

// Product Status
export const PRODUCT_STATUS = {
  IN_STOCK: 'in_stock',
  OUT_OF_STOCK: 'out_of_stock',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ADMIN_USER: 'adminUser',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Pagination Defaults
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
}; 