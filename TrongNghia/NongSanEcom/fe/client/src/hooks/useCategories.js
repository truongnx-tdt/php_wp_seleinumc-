import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import categoryService from '../services/categoryService';

export const useCategories = (initialParams = {}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });
  const [params, setParams] = useState(initialParams);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await categoryService.getCategories({
        ...params,
        page: pagination.page,
        limit: pagination.limit,
      });
      
      const categoriesList = Array.isArray(response) ? response : response.categories;
      const paginationData = response.pagination || response;
      
      setCategories(categoriesList || []);
      setPagination(prev => ({
        ...prev,
        totalPages: paginationData.totalPages || 1,
        total: paginationData.total || 0,
      }));
    } catch (err) {
      setError(err.message || 'Không thể tải danh mục');
      toast.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  }, [params, pagination.page, pagination.limit]);

  // Fetch categories with products count
  const fetchCategoriesWithProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await categoryService.getCategoriesWithProducts();
      const categoriesList = Array.isArray(response) ? response : response.categories;
      setCategories(categoriesList || []);
    } catch (err) {
      setError(err.message || 'Không thể tải danh mục');
      toast.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch featured categories
  const fetchFeaturedCategories = useCallback(async (limit = 8) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await categoryService.getFeaturedCategories(limit);
      const categoriesList = Array.isArray(response) ? response : response.categories;
      setCategories(categoriesList || []);
    } catch (err) {
      setError(err.message || 'Không thể tải danh mục nổi bật');
      toast.error('Không thể tải danh mục nổi bật');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get category by ID
  const getCategoryById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const category = await categoryService.getCategoryById(id);
      return category;
    } catch (err) {
      setError(err.message || 'Không thể tải chi tiết danh mục');
      toast.error('Không thể tải chi tiết danh mục');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get category products
  const getCategoryProducts = useCallback(async (categoryId, limit = 12) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await categoryService.getCategoryProducts(categoryId, {
        pageSize: limit,
      });
      const productsList = Array.isArray(response) ? response : response.products;
      return productsList || [];
    } catch (err) {
      setError(err.message || 'Không thể tải sản phẩm theo danh mục');
      toast.error('Không thể tải sản phẩm theo danh mục');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Update params
  const updateParams = useCallback((newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Change page
  const changePage = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setParams(initialParams);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [initialParams]);

  // Auto fetch when params or pagination changes
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    pagination,
    params,
    fetchCategories,
    fetchCategoriesWithProducts,
    fetchFeaturedCategories,
    getCategoryById,
    getCategoryProducts,
    updateParams,
    changePage,
    resetFilters,
  };
}; 