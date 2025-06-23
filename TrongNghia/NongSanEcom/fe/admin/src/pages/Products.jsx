import React from 'react';
import { PageHeader, DataTable, Button } from '../components/common';
import ProductFilterBar from '../components/products/ProductFilterBar';
import ProductFormModal from '../components/products/ProductFormModal';
import useProductFilters from '../hooks/useProductFilters';

const Products = () => {
  const {
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
  } = useProductFilters();

  const columns = [
    { key: 'index', header: 'STT', render: (_, __, index) => index + 1 },
    { key: 'name', header: 'Tên sản phẩm' },
    { key: 'price', header: 'Giá (VNĐ)', render: (price) => price?.toLocaleString() + '₫' },
    { key: 'countInStock', header: 'Tồn kho' },
    { key: 'category', header: 'Danh mục', render: (category) => category || '-' },
    { key: 'unit', header: 'Đơn vị', render: (unit) => unit || '-' },
    { key: 'discount', header: 'Giảm giá (%)', render: (discount) => discount || 0 },
    { key: 'countInStock', header: 'Trạng thái', align: 'center', render: (countInStock) => (<span className={`font-medium ${countInStock > 0 ? 'text-green-600' : 'text-red-500'}`}>{countInStock > 0 ? 'Hiển thị' : 'Ẩn'}</span>) },
    {
      key: 'actions',
      header: 'Hành động',
      align: 'center',
      render: (_, product) => (
        <div className="space-x-2">
          <Button variant="secondary" size="sm" onClick={() => openEditModal(product)}>Sửa</Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(product._id)}>Xóa</Button>
        </div>
      )
    }
  ];

  return (
    <div className="mx-auto">
      <PageHeader
        title="Quản lý sản phẩm"
        action={true}
        actionLabel="+ Thêm sản phẩm"
        onAction={openAddModal}
      />
      <ProductFilterBar filter={filter} setFilter={setFilter} CATEGORY_OPTIONS={CATEGORY_OPTIONS} />
      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        error={error}
        emptyMessage="Chưa có sản phẩm nào."
        pagination={pagination}
        onPageChange={setPage}
      />
      <ProductFormModal
        isOpen={showModal}
        onClose={closeModal}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
        CATEGORY_OPTIONS={CATEGORY_OPTIONS}
        STATUS_FORM_OPTIONS={STATUS_FORM_OPTIONS}
      />
    </div>
  );
};

export default Products;
