import React, { useEffect, useState } from 'react';
import API from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await API.get('/api/products');
        const productsList = Array.isArray(data) ? data : data.products;
        setProducts(productsList || []);
      } catch (err) {
        setError('Lỗi khi tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [refresh]);

  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await API.delete(`/api/products/${id}/delete`);
        setRefresh((prev) => !prev);
        toast.success('Xóa sản phẩm thành công');
      } catch (err) {
        toast.error('Xóa sản phẩm thất bại');
      }
    }
  };

  const editHandler = (id) => {
    navigate(`/admin/products/${id}/edit`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-extrabold text-gray-900">Quản lý sản phẩm</h2>
        <button
          onClick={() => navigate('/admin/products/create')}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-semibold transition"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 text-lg">Đang tải sản phẩm...</p>
      ) : error ? (
        <p className="text-center text-red-500 font-semibold">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 italic">Chưa có sản phẩm nào.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-700 font-semibold text-left">
              <tr>
                <th className="py-3 px-4">STT</th>
                <th className="py-3 px-4">Tên sản phẩm</th>
                <th className="py-3 px-4">Giá (VNĐ)</th>
                <th className="py-3 px-4">Tồn kho</th>
                <th className="py-3 px-4">Danh mục</th>
                <th className="py-3 px-4">Đơn vị</th>
                <th className="py-3 px-4">Giảm giá (%)</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {products.map((p, index) => (
                <tr key={p._id} className="hover:bg-green-50 transition-colors">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{p.name}</td>
                  <td className="py-3 px-4">{p.price.toLocaleString()}₫</td>
                  <td className="py-3 px-4">{p.countInStock}</td>
                  <td className="py-3 px-4">{p.category || '-'}</td>
                  <td className="py-3 px-4">{p.unit || '-'}</td>
                  <td className="py-3 px-4">{p.discount || 0}%</td>
                  <td
                    className={`py-3 px-4 text-center font-medium ${
                      p.countInStock > 0 ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {p.countInStock > 0 ? 'Hiển thị' : 'Ẩn'}
                  </td>
                  <td className="py-3 px-4 text-center space-x-2">
                    <button
                      onClick={() => editHandler(p._id)}
                      className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => deleteHandler(p._id)}
                      className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Products;
