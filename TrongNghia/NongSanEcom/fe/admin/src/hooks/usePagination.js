import { useState, useCallback } from 'react';
import { PAGINATION_DEFAULTS } from '../constants';

export const usePagination = (initialPage = PAGINATION_DEFAULTS.PAGE, initialLimit = PAGINATION_DEFAULTS.LIMIT) => {
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
  });

  const setPage = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit) => {
    setPagination(prev => ({ ...prev, limit, page: 1 })); // Reset to page 1 when changing limit
  }, []);

  const updatePagination = useCallback((paginationData) => {
    setPagination(prev => ({
      ...prev,
      ...paginationData,
    }));
  }, []);

  const resetPagination = useCallback(() => {
    setPagination({
      page: initialPage,
      limit: initialLimit,
      total: 0,
      totalPages: 0,
    });
  }, [initialPage, initialLimit]);

  return {
    pagination,
    setPage,
    setLimit,
    updatePagination,
    resetPagination,
  };
}; 