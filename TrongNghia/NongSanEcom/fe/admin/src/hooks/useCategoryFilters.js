import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../constants';
import API from '../utils/axiosInstance';

const useCategoryFilters = () => {
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: true
    });
    const [debouncedSearch, setDebouncedSearch] = useState(filter.search || '');

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(filter.search || '');
        }, 400);
        return () => clearTimeout(handler);
    }, [filter.search]);

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                search: debouncedSearch,
                status: filter.status || ''
            });

            const response = await API.get(`${API_ENDPOINTS.CATEGORIES.LIST}?${params}`);

            setCategories(response.data.categories || []);
            setPagination(prev => ({
                ...prev,
                total: response.data.total || 0,
                totalPages: response.data.totalPages || 0
            }));
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải danh mục');
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi tải danh mục');
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, debouncedSearch, filter.status]);

    // Set page
    const setPage = (page) => {
        setPagination(prev => ({ ...prev, page }));
    };

    // Modal handlers
    const openAddModal = () => {
        setEditingCategory(null);
        setFormData({
            name: '',
            description: '',
            isActive: true
        });
        setShowModal(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name || '',
            description: category.description || '',
            isActive: category.isActive !== undefined ? category.isActive : true
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({
            name: '',
            description: '',
            isActive: true
        });
    };

    // Form handlers
    const handleFormChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Vui lòng nhập tên danh mục');
            return;
        }

        try {
            if (editingCategory) {
                // Update category
                await API.put(API_ENDPOINTS.CATEGORIES.UPDATE(editingCategory._id), formData);
                toast.success('Cập nhật danh mục thành công');
            } else {
                // Create category
                await API.post(API_ENDPOINTS.CATEGORIES.CREATE, formData);
                toast.success('Thêm danh mục thành công');
            }

            closeModal();
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    // Delete category
    const handleDelete = async (categoryId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            return;
        }

        try {
            await API.delete(API_ENDPOINTS.CATEGORIES.DELETE(categoryId));
            toast.success('Xóa danh mục thành công');
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi xóa danh mục');
        }
    };

    // Fetch categories when component mounts or dependencies change
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
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
        editingCategory,
        handleSubmit,
        handleDelete,
        formData,
        setFormData,
        handleFormChange
    };
};

export default useCategoryFilters; 