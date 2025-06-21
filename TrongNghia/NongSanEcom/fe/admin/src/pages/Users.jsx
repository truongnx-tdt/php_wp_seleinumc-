import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { usePagination } from '../hooks/usePagination';
import { API_ENDPOINTS, USER_ROLES } from '../constants';
import { PageHeader, DataTable, Button, Pagination, Modal } from '../components/common';
import { toast } from 'react-toastify';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: USER_ROLES.STAFF,
  });

  const { get, post, put, delete: deleteApi, loading, error } = useApi();
  const { pagination, setPage, updatePagination } = usePagination();

  useEffect(() => {
    fetchUsers();
  }, [pagination.page]);

  const fetchUsers = async () => {
    try {
      const response = await get(`${API_ENDPOINTS.USERS.LIST}?page=${pagination.page}&limit=${pagination.limit}`);
      const { data } = response;
      
      setUsers(data.users || []);
      updatePagination({
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      });
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: USER_ROLES.STAFF,
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: USER_ROLES.STAFF,
    });
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        // Update user
        const updateData = { name: formData.name, email: formData.email, role: formData.role };
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        await put(API_ENDPOINTS.USERS.UPDATE(editingUser._id), updateData);
        toast.success('Cập nhật người dùng thành công!');
      } else {
        // Create user
        await post(API_ENDPOINTS.USERS.CREATE, formData);
        toast.success('Thêm người dùng thành công!');
      }
      
      closeModal();
      fetchUsers();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra!';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        await deleteApi(API_ENDPOINTS.USERS.DELETE(id));
        toast.success('Xóa người dùng thành công');
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      admin: 'Quản trị viên',
      staff: 'Nhân viên',
      customer: 'Khách hàng',
    };
    return roleLabels[role] || role;
  };

  const getRoleBadge = (role) => {
    const badgeClasses = {
      admin: 'bg-red-100 text-red-800',
      staff: 'bg-blue-100 text-blue-800',
      customer: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeClasses[role] || badgeClasses.customer}`}>
        {getRoleLabel(role)}
      </span>
    );
  };

  const columns = [
    { key: 'name', header: 'Họ tên' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Số điện thoại', render: (phone) => phone || '-' },
    { 
      key: 'role', 
      header: 'Vai trò', 
      render: (role) => getRoleBadge(role)
    },
    {
      key: 'createdAt',
      header: 'Ngày tạo',
      render: (createdAt) => {
        if (!createdAt) return '-';
        return new Date(createdAt).toLocaleDateString('vi-VN');
      }
    },
    {
      key: 'actions',
      header: 'Hành động',
      align: 'center',
      render: (_, user) => (
        <div className="space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openEditModal(user)}
          >
            Sửa
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(user._id)}
            disabled={user.role === USER_ROLES.ADMIN}
          >
            Xóa
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Quản lý người dùng"
        subtitle="Quản lý tài khoản người dùng trong hệ thống"
        action={true}
        actionLabel="+ Thêm người dùng"
        onAction={openAddModal}
      />

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        error={error}
        emptyMessage="Chưa có người dùng nào."
        showIndex={true}
      />

      <div className="mt-6">
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modal thêm/sửa user */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 z-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ tên *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu {!editingUser && '*'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required={!editingUser}
              minLength={6}
              placeholder={editingUser ? 'Để trống nếu không đổi mật khẩu' : ''}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value={USER_ROLES.STAFF}>Nhân viên</option>
              <option value={USER_ROLES.ADMIN}>Quản trị viên</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              {editingUser ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users; 