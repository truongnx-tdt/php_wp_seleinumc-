import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../constants';
import API from '../utils/axiosInstance';

const useUnitFilters = () => {
    const [units, setUnits] = useState([]);
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
    const [editingUnit, setEditingUnit] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        symbol: '',
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

    // Fetch units
    const fetchUnits = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                search: debouncedSearch,
                status: filter.status || ''
            });

            const response = await API.get(`${API_ENDPOINTS.UNITS.LIST}?${params}`);

            setUnits(response.data.units || []);
            setPagination(prev => ({
                ...prev,
                total: response.data.total || 0,
                totalPages: response.data.totalPages || 0
            }));
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải đơn vị');
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi tải đơn vị');
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
        setEditingUnit(null);
        setFormData({
            name: '',
            symbol: '',
            description: '',
            isActive: true
        });
        setShowModal(true);
    };

    const openEditModal = (unit) => {
        setEditingUnit(unit);
        setFormData({
            name: unit.name || '',
            symbol: unit.symbol || '',
            description: unit.description || '',
            isActive: unit.isActive !== undefined ? unit.isActive : true
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUnit(null);
        setFormData({
            name: '',
            symbol: '',
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
            toast.error('Vui lòng nhập tên đơn vị');
            return;
        }

        if (!formData.symbol.trim()) {
            toast.error('Vui lòng nhập ký hiệu đơn vị');
            return;
        }

        try {
            if (editingUnit) {
                // Update unit
                await API.put(API_ENDPOINTS.UNITS.UPDATE(editingUnit._id), formData);
                toast.success('Cập nhật đơn vị thành công');
            } else {
                // Create unit
                await API.post(API_ENDPOINTS.UNITS.CREATE, formData);
                toast.success('Thêm đơn vị thành công');
            }

            closeModal();
            fetchUnits();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    // Delete unit
    const handleDelete = async (unitId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đơn vị này?')) {
            return;
        }

        try {
            await API.delete(API_ENDPOINTS.UNITS.DELETE(unitId));
            toast.success('Xóa đơn vị thành công');
            fetchUnits();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi xóa đơn vị');
        }
    };

    // Fetch units when component mounts or dependencies change
    useEffect(() => {
        fetchUnits();
    }, [fetchUnits]);

    return {
        units,
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
        editingUnit,
        handleSubmit,
        handleDelete,
        formData,
        setFormData,
        handleFormChange
    };
};

export default useUnitFilters; 