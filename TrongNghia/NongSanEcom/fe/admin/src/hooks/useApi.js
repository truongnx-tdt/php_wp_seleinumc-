import { useState, useCallback } from 'react';
import API from '../utils/axiosInstance';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (apiCall, successCallback = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      if (successCallback) {
        successCallback(response.data);
      }
      return response.data;
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url, config = {}) => {
    return callApi(() => API.get(url, config));
  }, [callApi]);

  const post = useCallback((url, data = {}, config = {}) => {
    return callApi(() => API.post(url, data, config));
  }, [callApi]);

  const put = useCallback((url, data = {}, config = {}) => {
    return callApi(() => API.put(url, data, config));
  }, [callApi]);

  const del = useCallback((url, config = {}) => {
    return callApi(() => API.delete(url, config));
  }, [callApi]);

  return {
    loading,
    error,
    callApi,
    get,
    post,
    put,
    delete: del,
  };
}; 