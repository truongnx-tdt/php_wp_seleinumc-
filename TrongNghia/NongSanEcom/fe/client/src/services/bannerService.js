import api from './api';

export const bannerService = {
  // Lấy danh sách banner công khai
  getPublicBanners: async (position = 'home', category = null) => {
    try {
      const params = new URLSearchParams({ position });
      if (category) {
        params.append('category', category);
      }
      const response = await api.get(`/api/banners/public?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public banners:', error);
      throw error;
    }
  },

  // Lấy banner theo ID
  getBannerById: async (id) => {
    try {
      const response = await api.get(`/api/banners/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching banner:', error);
      throw error;
    }
  },

  // Lấy banner theo vị trí
  getBannersByPosition: async (position) => {
    try {
      const response = await api.get(`/api/banners/public?position=${position}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching banners by position:', error);
      throw error;
    }
  },

  // Lấy banner theo danh mục
  getBannersByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/api/banners/public?category=${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching banners by category:', error);
      throw error;
    }
  }
};

export default bannerService; 