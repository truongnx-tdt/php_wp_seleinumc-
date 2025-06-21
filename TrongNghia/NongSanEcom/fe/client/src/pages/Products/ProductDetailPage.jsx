import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useUser } from '../../UserContext'; // hook để lấy user

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/api/products/${id}`);
        setProduct(data);
      } catch {
        setError('Không tìm thấy sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    console.log('Thêm vào giỏ hàng:', product.name);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      toast.warn('Vui lòng chọn rating và nhập nhận xét!');
      return;
    }
    try {
      await API.post(`/api/products/${id}/reviews`, { rating, comment });
      toast.success('Gửi đánh giá thành công!');
      // Reload reviews
      const { data } = await API.get(`/api/products/${id}`);
      setProduct(data);
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err.response?.data.message || 'Gửi đánh giá thất bại');
    }
  };

  if (loading) return <p className="text-center py-10">Đang tải...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!product) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      {/* Thông tin chính */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-lg shadow p-6">
        <img src={product.images?.[0]} alt={product.name}
             className="w-full h-auto rounded object-cover" />

        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold text-green-700">{product.name}</h1>
          <p className="text-gray-700">Danh mục: {product.category}</p>
          <p className="text-gray-700">Xuất xứ: {product.origin || 'Không rõ'}</p>
          <p className="text-gray-700">Nhà cung cấp: {product.user.name}</p>
          <div className="text-2xl font-semibold text-gray-900">
            {product.discount > 0 ? (
              <>
                <span className="text-red-600">{(product.price * (1 - product.discount / 100)).toLocaleString()}₫</span>
                <span className="ml-2 text-gray-500 line-through text-base">{product.price.toLocaleString()}₫</span>
                <span className="ml-2 text-sm bg-red-100 text-red-600 rounded px-2 py-1">-{product.discount}%</span>
              </>
            ) : (
              <>{product.price.toLocaleString()}₫</>
            )}{' '}
            / {product.unit}
          </div>

          <p className="text-gray-600">{product.description}</p>

          <div className="mt-6 flex items-center space-x-4">
            <button onClick={handleAddToCart}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">Thêm vào giỏ hàng</button>
            <button onClick={() => navigate('/products')}
                    className="text-green-700 hover:underline">← Quay lại</button>
          </div>
        </div>
      </div>

      {/* Phần đánh giá */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow mt-10 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Đánh giá sản phẩm</h2>

        {product.reviews.length === 0 && <p className="text-gray-600">Chưa có đánh giá.</p>}

        {product.reviews.map((r) => (
          <div key={r._id} className="border-b border-gray-200 py-4">
            <p className="font-semibold">{r.name} <span className="text-sm text-gray-500">({new Date(r.createdAt).toLocaleDateString()})</span></p>
            <div className="flex items-center mb-2">
              <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              <span className="ml-2 text-gray-500">({r.rating}/5)</span>
            </div>
            <p className="text-gray-700">{r.comment}</p>
          </div>
        ))}

        {user ? (
          product.reviews.some((r) => r.user === user._id) ? (
            <p className="mt-4 text-gray-600">Bạn đã đánh giá sản phẩm này.</p>
          ) : (
            <form onSubmit={submitReview} className="mt-6">
              <h3 className="font-semibold mb-2">Viết đánh giá của bạn</h3>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}
                      className="border p-2 rounded mb-4 w-full">
                <option value={0}>Chọn đánh giá</option>
                {[5,4,3,2,1].map((v) => (
                  <option key={v} value={v}>{v} sao</option>
                ))}
              </select>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                        required rows={4} placeholder="Viết cảm nhận..."
                        className="border p-2 rounded mb-4 w-full"></textarea>
              <button type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Gửi đánh giá</button>
            </form>
          )
        ) : (
          <p className="mt-4 text-gray-600">
            <button onClick={() => navigate('/login')}
                    className="text-green-600 underline">Đăng nhập</button> để đánh giá
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
