import { useState, useEffect, useCallback } from 'react';
import { BANNER_ENDPOINTS, BANNER_POSITIONS, BANNER_STATUS_OPTIONS } from '../constants';
import { useApi } from './useApi';
import { usePagination } from './usePagination';
import { toast } from 'react-toastify';

const initialFilter = {
  search: '',
  position: '',
  isActive: '',
  startDate: '',
  endDate: '',
  sort: 'priority',
  order: 'desc',
};

const initialForm = {
  title: '',
  subtitle: '',
  description: '',
  image: '',
  link: '',
  linkText: '',
  position: 'home',
  category: '',
  product: '',
  isActive: true,
  startDate: '',
  endDate: '',
  priority: 0,
  backgroundColor: '#ffffff',
  textColor: '#000000',
};

const useBannerFilters = () => {
  const [banners, setBanners] = useState([]);
  const [filter, setFilter] = useState(initialFilter);
  const [formData, setFormData] = useState(initialForm);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const { get, post, put, delete: deleteApi, loading, error } = useApi();
  const { pagination, setPage, updatePagination } = usePagination();
  const [debouncedSearch, setDebouncedSearch] = useState(filter.search);
  const [CATEGORY_OPTIONS, setCategoryOptions] = useState([]);
  const [PRODUCT_OPTIONS, setProductOptions] = useState([]);
  
  // Loading states cho các thao tác
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filter.search);
    }, 400);
    return () => clearTimeout(handler);
  }, [filter.search]);

  // Fetch categories for form
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await get('/api/categories');
        const categories = Array.isArray(data) ? data : data.categories;
        setCategoryOptions(
          (categories || []).map(cat => ({ value: cat._id, label: cat.name }))
        );
      } catch (err) {
        toast.error('Không thể tải danh mục!');
      }
    };
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  // Fetch products for form
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await get('/api/products?pageSize=100');
        const products = Array.isArray(data) ? data : data.products;
        setProductOptions(
          (products || []).map(product => ({ value: product._id, label: product.name }))
        );
      } catch (err) {
        toast.error('Không thể tải sản phẩm!');
      }
    };
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  // Fetch banners
  useEffect(() => {
    fetchBanners();
    // eslint-disable-next-line
  }, [pagination.page, debouncedSearch, filter.position, filter.isActive, filter.sort, filter.order, filter.startDate, filter.endDate]);

  const fetchBanners = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        keyword: debouncedSearch,
        position: filter.position,
        isActive: filter.isActive,
        sort: filter.sort,
        order: filter.order,
        startDate: filter.startDate,
        endDate: filter.endDate,
      });
      const response = await get(`${BANNER_ENDPOINTS.LIST}?${params.toString()}`);
      const { banners, pagination: paginationData } = response;
      setBanners(banners || []);
      updatePagination({
        total: paginationData.total,
        totalPages: paginationData.totalPages,
      });
    } catch (err) {
      toast.error('Không thể tải banner!');
    }
  }, [get, pagination.page, pagination.limit, debouncedSearch, filter.position, filter.isActive, filter.sort, filter.order, filter.startDate, filter.endDate, updatePagination]);

  // Modal & form logic
  const openAddModal = () => {
    setEditingBanner(null);
    setFormData(initialForm);
    setShowModal(true);
  };
  
  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      image: banner.image || '',
      link: banner.link || '',
      linkText: banner.linkText || '',
      position: banner.position || 'home',
      category: banner.category?._id || banner.category || '',
      product: banner.product?._id || banner.product || '',
      isActive: banner.isActive !== undefined ? banner.isActive : true,
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : '',
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : '',
      priority: banner.priority || 0,
      backgroundColor: banner.backgroundColor || '#ffffff',
      textColor: banner.textColor || '#000000',
    });
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    setFormData(initialForm);
  };
  
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ngăn spam submit
    if (submitLoading) return;
    
    setSubmitLoading(true);
    try {
      const bannerData = {
        ...formData,
        priority: Number(formData.priority),
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };
      
      if (editingBanner) {
        await put(BANNER_ENDPOINTS.UPDATE(editingBanner._id), bannerData);
        toast.success('Cập nhật banner thành công!');
      } else {
        await post(BANNER_ENDPOINTS.CREATE, bannerData);
        toast.success('Thêm banner thành công!');
      }
      closeModal();
      fetchBanners();
    } catch (err) {
      toast.error(editingBanner ? 'Cập nhật banner thất bại!' : 'Thêm banner thất bại!');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa banner này?')) return;
    
    setDeleteLoading(prev => ({ ...prev, [id]: true }));
    try {
      await deleteApi(BANNER_ENDPOINTS.DELETE(id));
      toast.success('Xóa banner thành công!');
      fetchBanners();
    } catch (err) {
      toast.error('Xóa banner thất bại!');
    } finally {
      setDeleteLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await put(BANNER_ENDPOINTS.TOGGLE(id));
      toast.success('Cập nhật trạng thái banner thành công!');
      fetchBanners();
    } catch (err) {
      toast.error('Cập nhật trạng thái banner thất bại!');
    }
  };

  const handleUpdatePriority = async (id, priority) => {
    try {
      await put(BANNER_ENDPOINTS.PRIORITY(id), { priority: Number(priority) });
      toast.success('Cập nhật độ ưu tiên banner thành công!');
      fetchBanners();
    } catch (err) {
      toast.error('Cập nhật độ ưu tiên banner thất bại!');
    }
  };

  return {
    banners,
    pagination,
    loading,
    error,
    filter,
    setFilter,
    setPage,
    openAddModal,
    openEditModal,
    closeModal,
    showModal,
    editingBanner,
    handleSubmit,
    handleDelete,
    handleToggleStatus,
    handleUpdatePriority,
    formData,
    setFormData,
    handleFormChange,
    CATEGORY_OPTIONS,
    PRODUCT_OPTIONS,
    BANNER_POSITIONS,
    BANNER_STATUS_OPTIONS,
    submitLoading,
    deleteLoading
  };
};

export default useBannerFilters; 