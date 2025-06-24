import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '../constants';
import { useApi } from './useApi';
import { usePagination } from './usePagination';
import { toast } from 'react-toastify';

const STATUS_FORM_OPTIONS = [
  { value: 'active', label: 'Hiển thị' },
  { value: 'inactive', label: 'Ẩn' },
];

const initialFilter = {
  search: '',
  category: '',
  status: '',
  sort: 'createdAt',
  order: 'desc',
  createdAtFrom: '',
  createdAtTo: '',
};

const initialForm = {
  name: '',
  price: '',
  countInStock: '',
  category: '',
  unit: '',
  description: '',
  origin: '',
  discount: '',
  status: 'active',
  images: [],
};

const useProductFilters = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState(initialFilter);
  const [formData, setFormData] = useState(initialForm);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { get, post, put, delete: deleteApi, loading, error } = useApi();
  const { pagination, setPage, updatePagination } = usePagination();
  const [debouncedSearch, setDebouncedSearch] = useState(filter.search);
  const [CATEGORY_OPTIONS, setCategoryOptions] = useState([]);
  const [UNIT_OPTIONS, setUnitOptions] = useState([]);
  
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

  // Fetch categories for filter
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await get(API_ENDPOINTS.CATEGORIES.LIST);
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

  // Fetch units for filter
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const data = await get(API_ENDPOINTS.UNITS.LIST);
        const units = Array.isArray(data) ? data : data.units;
        setUnitOptions(
          (units || []).map(unit => ({ value: unit._id, label: `${unit.name} (${unit.symbol})` }))
        );
      } catch (err) {
        toast.error('Không thể tải đơn vị!');
      }
    };
    fetchUnits();
    // eslint-disable-next-line
  }, []);

  // Fetch products
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [pagination.page, debouncedSearch, filter.category, filter.status, filter.sort, filter.order, filter.createdAtFrom, filter.createdAtTo]);

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
        category: filter.category,
        status: filter.status,
        sort: filter.sort,
        order: filter.order,
        createdAtFrom: filter.createdAtFrom,
        createdAtTo: filter.createdAtTo,
      });
      const response = await get(`${API_ENDPOINTS.PRODUCTS.ADMIN_LIST}?${params.toString()}`);
      const { products, pagination: paginationData } = response;
      setProducts(products || []);
      updatePagination({
        total: paginationData.total,
        totalPages: paginationData.totalPages,
      });
    } catch (err) {
      toast.error('Không thể tải sản phẩm!');
    }
  }, [get, pagination.page, pagination.limit, debouncedSearch, filter.category, filter.status, filter.sort, filter.order, filter.createdAtFrom, filter.createdAtTo, updatePagination]);

  // Modal & form logic
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(initialForm);
    setShowModal(true);
  };
  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      countInStock: product.countInStock || '',
      category: product.category?._id || product.category || '',
      unit: product.unit?._id || product.unit || '',
      description: product.description || '',
      origin: product.origin || '',
      discount: product.discount || '',
      status: product.status || 'active',
      images: product.images || [],
    });
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData(initialForm);
  };
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ngăn spam submit
    if (submitLoading) return;
    
    setSubmitLoading(true);
    try {
      let images = formData.images;
      
      // Xử lý hình ảnh mới được thêm
      if (images && images.length > 0) {
        const uploadedUrls = [];
        for (const image of images) {
          if (image instanceof File) {
            // Upload hình ảnh mới
            const formDataImg = new FormData();
            formDataImg.append('image', image);
            const res = await post('/api/upload', formDataImg, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            uploadedUrls.push(res.data.url);
          } else if (typeof image === 'string') {
            // Giữ lại URL hình ảnh cũ
            uploadedUrls.push(image);
          }
        }
        images = uploadedUrls;
      }
      
      const productData = {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
        discount: Number(formData.discount) || 0,
        images,
      };
      
      if (editingProduct) {
        await put(API_ENDPOINTS.PRODUCTS.UPDATE(editingProduct._id), productData);
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        await post(API_ENDPOINTS.PRODUCTS.CREATE, productData);
        toast.success('Thêm sản phẩm thành công!');
      }
      closeModal();
      fetchProducts();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra!';
      toast.error(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      // Ngăn spam delete
      if (deleteLoading[id]) return;
      
      setDeleteLoading(prev => ({ ...prev, [id]: true }));
      try {
        await deleteApi(API_ENDPOINTS.PRODUCTS.DELETE(id));
        toast.success('Xóa sản phẩm thành công');
        fetchProducts();
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Không thể xóa sản phẩm!';
        toast.error(errorMessage);
      } finally {
        setDeleteLoading(prev => ({ ...prev, [id]: false }));
      }
    }
  };

  return {
    products,
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
    editingProduct,
    handleSubmit,
    handleDelete,
    formData,
    setFormData,
    handleFormChange,
    CATEGORY_OPTIONS,
    UNIT_OPTIONS,
    STATUS_FORM_OPTIONS,
    submitLoading,
    deleteLoading
  };
};

export default useProductFilters; 