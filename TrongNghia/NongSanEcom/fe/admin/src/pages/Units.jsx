import React from 'react';
import { PageHeader, DataTable, Button } from '../components/common';
import UnitFilterBar from '../components/units/UnitFilterBar';
import UnitFormModal from '../components/units/UnitFormModal';
import useUnitFilters from '../hooks/useUnitFilters';

const Units = () => {
  const {
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
  } = useUnitFilters();

  const columns = [
    { key: 'name', header: 'Tên đơn vị' },
    { key: 'symbol', header: 'Ký hiệu' },
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
      render: (_, unit) => (
        <div className="space-x-2">
          <Button variant="secondary" size="sm" onClick={() => openEditModal(unit)}>Sửa</Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(unit._id)}>Xóa</Button>
        </div>
      )
    }
  ];

  return (
    <div className="mx-auto">
      <PageHeader
        title="Quản lý đơn vị sản phẩm"
        action={true}
        actionLabel="+ Thêm đơn vị"
        onAction={openAddModal}
      />
      <UnitFilterBar filter={filter} setFilter={setFilter} />
      <DataTable
        columns={columns}
        data={units}
        loading={loading}
        error={error}
        emptyMessage="Chưa có đơn vị nào."
        pagination={pagination}
        onPageChange={setPage}
      />
      <UnitFormModal
        isOpen={showModal}
        onClose={closeModal}
        editingUnit={editingUnit}
        formData={formData}
        setFormData={setFormData}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Units; 