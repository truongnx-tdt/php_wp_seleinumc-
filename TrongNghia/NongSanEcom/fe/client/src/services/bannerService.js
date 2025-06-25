import api from './api';

export const bannerService = {
  // Lấy danh sách banner công khai
  getPublicBanners: async (position = 'home', category = null) => {
    try {
      const params = new URLSearchParams({ position });
      if (category) {
        params.append('category', category);
      }
      
      const url = `/api/banners/public?${params.toString()}`;
      console.log('Calling banner API:', url);
      
      const response = await api.get(url);
      console.log('Banner API response:', response);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching public banners:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
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