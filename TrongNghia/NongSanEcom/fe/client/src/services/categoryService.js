import API from './api';

// Category API endpoints
const CATEGORY_ENDPOINTS = {
  LIST: '/api/categories',
  DETAIL: (id) => `/api/categories/${id}`,
  PRODUCTS: (id) => `/api/categories/${id}/products`,
};

export const categoryService = {
  // Lấy danh sách tất cả danh mục
  getCategories: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    
    const url = `${CATEGORY_ENDPOINTS.LIST}?${queryParams.toString()}`;
    const response = await API.get(url);
    return response.data;
  },

  // Lấy chi tiết danh mục
  getCategoryById: async (id) => {
    const response = await API.get(CATEGORY_ENDPOINTS.DETAIL(id));
    return response.data;
  },

  // Lấy sản phẩm theo danh mục
  getCategoryProducts: async (categoryId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('pageNumber', params.page);
    if (params.limit) queryParams.append('pageSize', params.limit);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);
    
    const url = `${CATEGORY_ENDPOINTS.PRODUCTS(categoryId)}?${queryParams.toString()}`;
    const response = await API.get(url);
    return response.data;
  },

  // Lấy danh mục có sản phẩm
  getCategoriesWithProducts: async () => {
    const response = await API.get(CATEGORY_ENDPOINTS.LIST);
    return response.data;
  },

  // Lấy danh mục nổi bật
  getFeaturedCategories: async (limit = 8) => {
    const response = await API.get(`${CATEGORY_ENDPOINTS.LIST}?featured=true&limit=${limit}`);
    return response.data;
  },
};

export default categoryService; 