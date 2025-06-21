import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useApi } from '../hooks/useApi';
import { API_ENDPOINTS } from '../constants';
import { PageHeader, DataTable, Button } from '../components/common';

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { get, delete: deleteApi, loading, error } = useApi();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await get(API_ENDPOINTS.PRODUCTS.LIST);
      const productsList = Array.isArray(data) ? data : data.products;
      setProducts(productsList || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await deleteApi(API_ENDPOINTS.PRODUCTS.DELETE(id));
        toast.success('Xóa sản phẩm thành công');
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/products/${id}/edit`);
  };

  const columns = [
    { key: 'index', header: 'STT', render: (_, __, index) => index + 1 },
    { key: 'name', header: 'Tên sản phẩm' },
    { 
      key: 'price', 
      header: 'Giá (VNĐ)', 
      render: (price) => price?.toLocaleString() + '₫' 
    },
    { key: 'countInStock', header: 'Tồn kho' },
    { key: 'category', header: 'Danh mục', render: (category) => category || '-' },
    { key: 'unit', header: 'Đơn vị', render: (unit) => unit || '-' },
    { key: 'discount', header: 'Giảm giá (%)', render: (discount) => discount || 0 },
    { 
      key: 'countInStock', 
      header: 'Trạng thái', 
      align: 'center',
      render: (countInStock) => (
        <span className={`font-medium ${countInStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
          {countInStock > 0 ? 'Hiển thị' : 'Ẩn'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Hành động',
      align: 'center',
      render: (_, product) => (
        <div className="space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEdit(product._id)}
          >
            Sửa
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(product._id)}
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
        title="Quản lý sản phẩm"
        action={true}
        actionLabel="+ Thêm sản phẩm"
        onAction={() => navigate('/admin/products/create')}
      />

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        error={error}
        emptyMessage="Chưa có sản phẩm nào."
      />
    </div>
  );
};

export default Products;
