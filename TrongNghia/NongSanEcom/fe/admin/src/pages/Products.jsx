import React from 'react';
import { PageHeader, DataTable, Button, Pagination } from '../components/common';
import ProductFilterBar from '../components/products/ProductFilterBar';
import ProductFormModal from '../components/products/ProductFormModal';
import ProductDetailModal from '../components/products/ProductDetailModal';
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
    UNIT_OPTIONS,
    STATUS_FORM_OPTIONS,
    submitLoading,
    deleteLoading
  } = useProductFilters();

  const [detailModal, setDetailModal] = React.useState({
    isOpen: false,
    product: null
  });

  const handleRowDoubleClick = (product) => {
    setDetailModal({
      isOpen: true,
      product: product
    });
  };

  const closeDetailModal = () => {
    setDetailModal({
      isOpen: false,
      product: null
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const columns = [
    { key: 'name', header: 'Tên sản phẩm' },
    { key: 'price', header: 'Giá (VNĐ)', render: (price) => price?.toLocaleString() + '₫' },
    { key: 'countInStock', header: 'Tồn kho' },
    { key: 'category', header: 'Danh mục', render: (category) => category?.name || '-' },
    { key: 'unit', header: 'Đơn vị', render: (unit) => unit ? `${unit.name} (${unit.symbol})` : '-' },
    { key: 'discount', header: 'Giảm giá (%)', render: (discount) => discount || 0 },
    { key: 'createdBy', header: 'Người tạo', render: (createdBy) => createdBy?.name || '-' },
    { key: 'updatedBy', header: 'Người sửa', render: (updatedBy) => updatedBy?.name || '-' },
    { key: 'createdAt', header: 'Ngày tạo', render: (createdAt) => formatDate(createdAt) },
    { key: 'countInStock', header: 'Trạng thái', align: 'center', render: (countInStock) => (
      <span className={`font-medium ${countInStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
        {countInStock > 0 ? 'Hiển thị' : 'Ẩn'}
      </span>
    )},
    {
      key: 'actions',
      header: 'Hành động',
      align: 'center',
      render: (_, product) => (
        <div className="space-x-2">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => openEditModal(product)}
            disabled={submitLoading || deleteLoading[product._id]}
          >
            Sửa
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => handleDelete(product._id)}
            disabled={submitLoading || deleteLoading[product._id]}
          >
            {deleteLoading[product._id] ? (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Xóa...</span>
              </div>
            ) : (
              'Xóa'
            )}
          </Button>
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
        actionDisabled={submitLoading}
      />
      <ProductFilterBar 
        filter={filter} 
        setFilter={setFilter} 
        CATEGORY_OPTIONS={CATEGORY_OPTIONS} 
        disabled={submitLoading}
      />
      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        error={error}
        emptyMessage="Chưa có sản phẩm nào."
        onRowDoubleClick={submitLoading ? null : handleRowDoubleClick}
      />
      {pagination.totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={submitLoading ? null : setPage}
          />
        </div>
      )}
      <ProductFormModal
        isOpen={showModal}
        onClose={closeModal}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
        CATEGORY_OPTIONS={CATEGORY_OPTIONS}
        UNIT_OPTIONS={UNIT_OPTIONS}
        STATUS_FORM_OPTIONS={STATUS_FORM_OPTIONS}
        submitLoading={submitLoading}
      />
      <ProductDetailModal
        isOpen={detailModal.isOpen}
        onClose={closeDetailModal}
        product={detailModal.product}
      />
    </div>
  );
};

export default Products;
