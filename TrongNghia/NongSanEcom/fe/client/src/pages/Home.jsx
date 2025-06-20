import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/axiosInstance';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/api/products');
        const productsList = Array.isArray(data) ? data : data.products;
        setProducts(productsList.slice(0, 6)); // Chỉ lấy 6 sản phẩm nổi bật
      } catch (err) {
        setError('Không thể tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-green-100 py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-4">
          Chào mừng đến với Nông Sản Ecom
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          Nền tảng kết nối người tiêu dùng với nhà cung cấp nông sản sạch, tươi và đáng tin cậy.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="mt-6 inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-md transition"
        >
          Khám phá sản phẩm
        </button>
      </div>

      {/* Section: Sản phẩm nổi bật */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Sản phẩm nổi bật
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Đang tải sản phẩm...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition"
              >
                <img
                  src={p.images?.[0] || 'https://source.unsplash.com/400x250/?fruit'}
                  alt={p.name}
                  className="rounded-t-lg w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-green-700">{p.name}</h3>
                  {p.discount > 0 ? (
                    <div className="mt-1 text-sm text-gray-700 space-y-1">
                      <p className="line-through text-red-500">
                        Giá gốc: {p.price.toLocaleString()}₫
                      </p>
                      <p className="font-semibold text-green-700">
                        Giá sau giảm: {(p.price * (1 - p.discount / 100)).toLocaleString()}₫ / {p.unit}
                      </p>
                      <p className="text-sm text-yellow-600 font-medium">Giảm {p.discount}%</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">
                      Giá: {p.price.toLocaleString()}₫ / {p.unit}
                    </p>
                  )}
                  <button
                    onClick={() => navigate(`/products/${p._id}`)}
                    className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded transition"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section: Nhà cung cấp uy tín */}
      <div className="bg-white py-16 px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Nhà cung cấp uy tín
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[1, 2, 3].map((id) => (
            <div
              key={id}
              className="bg-green-50 border border-green-100 rounded-lg p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Hợp tác xã Nông sản {id}
              </h3>
              <p className="text-gray-700 text-sm">
                Chuyên cung cấp rau củ quả sạch, canh tác hữu cơ và đạt chuẩn VietGAP.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 text-white text-center py-10 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-3">
          Trở thành đối tác hoặc khách hàng của Nông Sản Ecom ngay hôm nay!
        </h2>
        <button
          onClick={() => navigate('/products')}
          className="bg-white text-green-700 font-bold px-6 py-3 rounded-md mt-4 hover:bg-gray-100 transition"
        >
          Bắt đầu mua sắm
        </button>
      </div>
    </div>
  );
};

export default Home;
