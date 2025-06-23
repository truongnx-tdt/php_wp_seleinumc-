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
        // toast.error('Không thể tải danh mục!');
      }
    };
    fetchCategories();
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
      const response = await get(`${API_ENDPOINTS.PRODUCTS.LIST}?${params.toString()}`);
      const { products, total, totalPages } = response;
      setProducts(products || []);
      updatePagination({
        total: total,
        totalPages: totalPages,
      });
    } catch (err) {
      // toast.error('Không thể tải sản phẩm!');
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
      unit: product.unit || '',
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
    try {
      let images = formData.images;
      if (images && images.length > 0 && images[0] instanceof File) {
        const uploadedUrls = [];
        for (const file of images) {
          const formDataImg = new FormData();
          formDataImg.append('image', file);
          const res = await post('/api/upload', formDataImg, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          uploadedUrls.push(res.data.url);
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
      fetchProducts();
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await deleteApi(API_ENDPOINTS.PRODUCTS.DELETE(id));
        toast.success('Xóa sản phẩm thành công');
        fetchProducts();
      } catch (err) {
        // toast.error('Không thể xóa sản phẩm!');
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
    STATUS_FORM_OPTIONS
  };
};

export default useProductFilters; 