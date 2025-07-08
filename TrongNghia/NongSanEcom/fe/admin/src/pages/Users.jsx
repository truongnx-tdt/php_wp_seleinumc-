import React, { useState } from 'react';
import { PageHeader, DataTable, Button, Pagination } from '../components/common';
import UserFilterBar from '../components/users/UserFilterBar';
import UserFormModal from '../components/users/UserFormModal';
import useUserFilters from '../hooks/useUserFilters';

const Users = () => {
  const {
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
    handleBan,
    formData,
    setFormData,
    handleFormChange,
    STATUS_FORM_OPTIONS,
    USER_ROLES
  } = useUserFilters();

  const getDefaultAddress = (user) => {
    if (!user.addresses || user.addresses.length === 0) return '-';
    const addr = user.addresses.find(a => a.isDefault) || user.addresses[0];
    if (!addr) return '-';
    return [addr.street, addr.ward, addr.district, addr.city, addr.country].filter(Boolean).join(', ');
  };

  const columns = [
    { key: 'name', header: 'Họ tên' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Số điện thoại', render: (phone) => phone || '-' },
    { key: 'address', header: 'Địa chỉ', render: (_, user) => getDefaultAddress(user) },
    { key: 'role', header: 'Vai trò', render: (role) => USER_ROLES[role.toUpperCase()] || role },
    { key: 'status', header: 'Trạng thái', render: (status) => <span className={`px-2 py-1 text-xs rounded-full font-medium ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500'}`}>{status === 'active' ? 'Hoạt động' : status === 'banned' ? 'Bị khóa' : 'Ngừng hoạt động'}</span> },
    { key: 'createdAt', header: 'Ngày tạo', render: (createdAt) => createdAt ? new Date(createdAt).toLocaleDateString('vi-VN') : '-' },
    {
      key: 'actions',
      header: 'Hành động',
      align: 'center',
      render: (_, user) => (
        <div className="space-x-2">
          <Button variant="secondary" size="sm" onClick={() => openEditModal(user)}>Sửa</Button>
          <Button variant="danger" size="sm" onClick={() => handleBan(user._id)} disabled={user.role === 'admin'}>Khóa TK</Button>
        </div>
      )
    }
  ];

  return (
    <div className="mx-auto">
      <PageHeader
        title="Quản lý người dùng"
        subtitle="Quản lý tài khoản người dùng trong hệ thống"
        action={true}
        actionLabel="+ Thêm người dùng"
        onAction={openAddModal}
      />
      <UserFilterBar filter={filter} setFilter={setFilter} />
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
          onPageChange={setPage}
        />
      </div>
      <UserFormModal
        isOpen={showModal}
        onClose={closeModal}
        editingUser={editingUser}
        formData={formData}
        setFormData={setFormData}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
        STATUS_FORM_OPTIONS={STATUS_FORM_OPTIONS}
        USER_ROLES={USER_ROLES}
      />
    </div>
  );
};

export default Users; 