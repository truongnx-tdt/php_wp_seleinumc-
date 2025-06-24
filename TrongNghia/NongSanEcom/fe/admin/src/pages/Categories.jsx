import React from 'react';
import { PageHeader, DataTable, Button } from '../components/common';
import CategoryFilterBar from '../components/categories/CategoryFilterBar';
import CategoryFormModal from '../components/categories/CategoryFormModal';
import useCategoryFilters from '../hooks/useCategoryFilters';

const Categories = () => {
  const {
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
  } = useCategoryFilters();

  const columns = [
    { key: 'name', header: 'Tên danh mục' },
    { key: 'description', header: 'Mô tả', render: (description) => description || '-' },
    { key: 'productCount', header: 'Số sản phẩm', render: (productCount) => productCount || 0 },
    { key: 'isActive', header: 'Trạng thái', align: 'center', render: (isActive) => (
      <span className={`font-medium ${isActive ? 'text-green-600' : 'text-red-500'}`}>
        {isActive ? 'Hoạt động' : 'Ẩn'}
      </span>
    )},
    { key: 'createdAt', header: 'Ngày tạo', render: (createdAt) => new Date(createdAt).toLocaleDateString('vi-VN') },
    {
      key: 'actions',
      header: 'Hành động',
      align: 'center',
      render: (_, category) => (
        <div className="space-x-2">
          <Button variant="secondary" size="sm" onClick={() => openEditModal(category)}>Sửa</Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(category._id)}>Xóa</Button>
        </div>
      )
    }
  ];

  return (
    <div className="mx-auto">
      <PageHeader
        title="Quản lý danh mục sản phẩm"
        action={true}
        actionLabel="+ Thêm danh mục"
        onAction={openAddModal}
      />
      <CategoryFilterBar filter={filter} setFilter={setFilter} />
      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        error={error}
        emptyMessage="Chưa có danh mục nào."
        pagination={pagination}
        onPageChange={setPage}
      />
      <CategoryFormModal
        isOpen={showModal}
        onClose={closeModal}
        editingCategory={editingCategory}
        formData={formData}
        setFormData={setFormData}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Categories; 