import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import productService from '../services/productService';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 12,
  });
  const [params, setParams] = useState(initialParams);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.getProducts({
        ...params,
        page: pagination.page,
        limit: pagination.limit,
      });
      
      const productsList = Array.isArray(response) ? response : response.products;
      const paginationData = response.pagination || response;
      
      setProducts(productsList || []);
      setPagination(prev => ({
        ...prev,
        totalPages: paginationData.totalPages || 1,
        total: paginationData.total || 0,
      }));
    } catch (err) {
      setError(err.message || 'Không thể tải sản phẩm');
      toast.error('Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [params, pagination.page, pagination.limit]);

  // Fetch featured products
  const fetchFeaturedProducts = useCallback(async (limit = 8) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.getFeaturedProducts(limit);
      const productsList = Array.isArray(response) ? response : response.products;
      setProducts(productsList || []);
    } catch (err) {
      setError(err.message || 'Không thể tải sản phẩm nổi bật');
      toast.error('Không thể tải sản phẩm nổi bật');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch products by category
  const fetchProductsByCategory = useCallback(async (categoryId, limit = 12) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.getProductsByCategory(categoryId, {
        pageSize: limit,
      });
      const productsList = Array.isArray(response) ? response : response.products;
      setProducts(productsList || []);
    } catch (err) {
      setError(err.message || 'Không thể tải sản phẩm theo danh mục');
      toast.error('Không thể tải sản phẩm theo danh mục');
    } finally {
      setLoading(false);
    }
  }, []);

  // Search products
  const searchProducts = useCallback(async (keyword, searchParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.searchProducts(keyword, searchParams);
      const productsList = Array.isArray(response) ? response : response.products;
      setProducts(productsList || []);
    } catch (err) {
      setError(err.message || 'Không thể tìm kiếm sản phẩm');
      toast.error('Không thể tìm kiếm sản phẩm');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get product by ID
  const getProductById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const product = await productService.getProductById(id);
      return product;
    } catch (err) {
      setError(err.message || 'Không thể tải chi tiết sản phẩm');
      toast.error('Không thể tải chi tiết sản phẩm');
      return null;
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
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    pagination,
    params,
    fetchProducts,
    fetchFeaturedProducts,
    fetchProductsByCategory,
    searchProducts,
    getProductById,
    updateParams,
    changePage,
    resetFilters,
  };
}; 