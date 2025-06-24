import API from './api';

// Product API endpoints
const PRODUCT_ENDPOINTS = {
  LIST: '/api/products',
  DETAIL: (id) => `/api/products/${id}`,
  SEARCH: '/api/products',
  FEATURED: '/api/products?featured=true',
  BY_CATEGORY: (categoryId) => `/api/products?category=${categoryId}`,
  REVIEWS: (id) => `/api/products/${id}/reviews`,
};

export const productService = {
  // Lấy danh sách sản phẩm với pagination và filter
  getProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Thêm các tham số vào query
    if (params.page) queryParams.append('pageNumber', params.page);
    if (params.limit) queryParams.append('pageSize', params.limit);
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.category) queryParams.append('category', params.category);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    if (params.isOrganic !== undefined) queryParams.append('isOrganic', params.isOrganic);
    
    const url = `${PRODUCT_ENDPOINTS.LIST}?${queryParams.toString()}`;
    const response = await API.get(url);
    return response.data;
  },

  // Lấy chi tiết sản phẩm
  getProductById: async (id) => {
    const response = await API.get(PRODUCT_ENDPOINTS.DETAIL(id));
    return response.data;
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (keyword, params = {}) => {
    const queryParams = new URLSearchParams({ keyword, ...params });
    const url = `${PRODUCT_ENDPOINTS.SEARCH}?${queryParams.toString()}`;
    const response = await API.get(url);
    return response.data;
  },

  // Lấy sản phẩm nổi bật
  getFeaturedProducts: async (limit = 8) => {
    const response = await API.get(`${PRODUCT_ENDPOINTS.FEATURED}&pageSize=${limit}`);
    return response.data;
  },

  // Lấy sản phẩm theo danh mục
  getProductsByCategory: async (categoryId, params = {}) => {
    const queryParams = new URLSearchParams({ category: categoryId, ...params });
    const url = `${PRODUCT_ENDPOINTS.LIST}?${queryParams.toString()}`;
    const response = await API.get(url);
    return response.data;
  },

  // Lấy đánh giá sản phẩm
  getProductReviews: async (productId) => {
    const response = await API.get(PRODUCT_ENDPOINTS.REVIEWS(productId));
    return response.data;
  },

  // Thêm đánh giá sản phẩm (cần đăng nhập)
  addProductReview: async (productId, reviewData) => {
    const response = await API.post(PRODUCT_ENDPOINTS.REVIEWS(productId), reviewData);
    return response.data;
  },

  // Lấy sản phẩm liên quan
  getRelatedProducts: async (productId, limit = 4) => {
    const response = await API.get(`${PRODUCT_ENDPOINTS.LIST}?related=${productId}&pageSize=${limit}`);
    return response.data;
  },

  // Lấy sản phẩm mới nhất
  getLatestProducts: async (limit = 8) => {
    const response = await API.get(`${PRODUCT_ENDPOINTS.LIST}?sort=createdAt&order=desc&pageSize=${limit}`);
    return response.data;
  },

  // Lấy sản phẩm bán chạy
  getBestSellingProducts: async (limit = 8) => {
    const response = await API.get(`${PRODUCT_ENDPOINTS.LIST}?sort=soldCount&order=desc&pageSize=${limit}`);
    return response.data;
  },

  // Lấy sản phẩm giảm giá
  getDiscountedProducts: async (limit = 8) => {
    const response = await API.get(`${PRODUCT_ENDPOINTS.LIST}?discount=true&pageSize=${limit}`);
    return response.data;
  },
};

export default productService; 