import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS, USER_ROLES } from '../constants';
import { useApi } from './useApi';
import { usePagination } from './usePagination';
import { toast } from 'react-toastify';

const STATUS_FORM_OPTIONS = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'banned', label: 'Bị khóa' },
];

const initialFilter = {
  search: '',
  role: '',
  status: '',
  sort: 'createdAt',
  order: 'desc',
  createdAtFrom: '',
  createdAtTo: '',
};

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: USER_ROLES.STAFF,
  phone: '',
  status: 'active',
};

const useUserFilters = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState(initialFilter);
  const [formData, setFormData] = useState(initialForm);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { get, post, put, delete: deleteApi, loading, error } = useApi();
  const { pagination, setPage, updatePagination } = usePagination();
  const [debouncedSearch, setDebouncedSearch] = useState(filter.search);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filter.search);
    }, 400);
    return () => clearTimeout(handler);
  }, [filter.search]);

  // Fetch users
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [pagination.page, debouncedSearch, filter.role, filter.status, filter.sort, filter.order, filter.createdAtFrom, filter.createdAtTo]);

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
        role: filter.role,
        status: filter.status,
        sort: filter.sort,
        order: filter.order,
        createdAtFrom: filter.createdAtFrom,
        createdAtTo: filter.createdAtTo,
      });
      const response = await get(`${API_ENDPOINTS.USERS.LIST}?${params.toString()}`);
      const { users, total, totalPages } = response;
      setUsers(users || []);
      updatePagination({
        total: total,
        totalPages: totalPages,
      });
    } catch (err) {
      // toast.error('Không thể tải danh sách người dùng!');
    }
  }, [get, pagination.page, pagination.limit, debouncedSearch, filter.role, filter.status, filter.sort, filter.order, filter.createdAtFrom, filter.createdAtTo, updatePagination]);

  // Modal & form logic
  const openAddModal = () => {
    setEditingUser(null);
    setFormData(initialForm);
    setShowModal(true);
  };
  const openEditModal = (user) => {
    setEditingUser(user);
    // set form data = user data
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || '',
      phone: user.phone || '',
      status: user.status,
      addresses: user.addresses || [],
    });
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData(initialForm);
  };
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updateData = { name: formData.name, email: formData.email, role: formData.role, phone: formData.phone, status: formData.status, addresses: formData.addresses };
        if (formData.password) {
          toast.error('Không cho phép thay đổi mật khẩu khi sửa người dùng!');
          return;
        }
        await put(API_ENDPOINTS.USERS.UPDATE(editingUser._id), updateData);
        toast.success('Cập nhật người dùng thành công!');
      } else {
        // check if password min length 8, have at least 1 uppercase, 1 lowercase, 1 number, 1 special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
          toast.error('Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số và 1 ký tự đặc biệt');
          return;
        }
        await post(API_ENDPOINTS.USERS.CREATE, formData);
        toast.success('Thêm người dùng thành công!');
      }
      closeModal();
      fetchUsers();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra!';
      toast.error(errorMessage);
      fetchUsers();
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        await deleteApi(API_ENDPOINTS.USERS.DELETE(id));
        toast.success('Xóa người dùng thành công');
        fetchUsers();
      } catch (err) {
        // toast.error('Không thể xóa người dùng!');
      }
    }
  };

  return {
    users,
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
    editingUser,
    handleSubmit,
    handleDelete,
    formData,
    setFormData,
    handleFormChange,
    STATUS_FORM_OPTIONS,
    USER_ROLES
  };
};

export default useUserFilters; 