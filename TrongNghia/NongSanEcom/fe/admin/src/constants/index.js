// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
  },
  PRODUCTS: {
    LIST: '/api/products',
    CREATE: '/api/products',
    UPDATE: (id) => `/api/products/${id}`,
    DELETE: (id) => `/api/products/${id}/delete`,
    DETAIL: (id) => `/api/products/${id}`,
  },
  CATEGORIES: {
    LIST: '/api/categories',
    CREATE: '/api/categories',
    UPDATE: (id) => `/api/categories/${id}`,
    DELETE: (id) => `/api/categories/${id}`,
    DETAIL: (id) => `/api/categories/${id}`,
  },
  UNITS: {
    LIST: '/api/units',
    CREATE: '/api/units',
    UPDATE: (id) => `/api/units/${id}`,
    DELETE: (id) => `/api/units/${id}`,
    DETAIL: (id) => `/api/units/${id}`,
  },
  USERS: {
    LIST: '/api/users',
    CREATE: '/api/users',
    UPDATE: (id) => `/api/users/${id}`,
    DELETE: (id) => `/api/users/${id}`,
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
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard', roles: [USER_ROLES.ADMIN] },
  { to: '/users', label: 'Quản trị người dùng', icon: 'users', roles: [USER_ROLES.ADMIN] },
  { to: '/orders', label: 'Đơn hàng', icon: 'orders', roles: [USER_ROLES.ADMIN, USER_ROLES.STAFF] },
  { to: '/products', label: 'Sản phẩm', icon: 'products', roles: [USER_ROLES.ADMIN, USER_ROLES.STAFF] },
  { to: '/categories', label: 'Danh mục', icon: 'categories', roles: [USER_ROLES.ADMIN] },
  { to: '/units', label: 'Đơn vị', icon: 'units', roles: [USER_ROLES.ADMIN] },
  { to: '/settings', label: 'Cài đặt', icon: 'settings', roles: [USER_ROLES.ADMIN] },
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