import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useUser } from '../../UserContext'; // hook để lấy user
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { FaHeart, FaRegHeart, FaMinus, FaPlus } from 'react-icons/fa';
import ProductCard from '../../components/ProductCard';
import productService from '../../services/productService';
import cartService from '../../services/cartService';
import Header from '../../components/Header';

const DEFAULT_IMAGE = 'https://source.unsplash.com/600x400/?fruit,vegetable';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateCartCount } = useUser();

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false); // TODO: fetch wishlist state from API/user
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/api/products/${id}`);
        setProduct(data);
        // Fetch related products (same category, exclude current)
        if (data.category?._id || data.category) {
          setRelatedLoading(true);
          const catId = data.category._id || data.category;
          const res = await productService.getProductsByCategory(catId, { pageSize: 8 });
          // Exclude current product
          setRelatedProducts((res.products || res.data || []).filter(p => p._id !== id));
        }
      } catch {
        setError('Không tìm thấy sản phẩm');
      } finally {
        setLoading(false);
        setRelatedLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const images = product?.images && product.images.length > 0 ? product.images : [DEFAULT_IMAGE];

  // Giá hiện tại
  const currentPrice = product ? (product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price) : 0;
  const totalPrice = currentPrice * quantity;

  // Wishlist handler (demo, cần kết nối API thực tế)
  const handleToggleWishlist = () => {
    if (!user) {
      toast.info('Vui lòng đăng nhập để sử dụng mục yêu thích!');
      navigate('/login');
      return;
    }
    setIsWishlisted((prev) => !prev);
    toast.info(isWishlisted ? 'Đã xóa khỏi mục yêu thích' : 'Đã thêm vào mục yêu thích');
  };

  // Số lượng
  const handleQuantityChange = (val) => {
    if (!product) return;
    setQuantity((prev) => {
      let next = prev + val;
      if (next < 1) next = 1;
      if (next > product.countInStock) next = product.countInStock;
      return next;
    });
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.info('Vui lòng đăng nhập để mua hàng!');
      navigate('/login');
      return;
    }
    if (!product || product.countInStock <= 0) return;
    try {
      await cartService.addToCart(product._id, quantity);
      if (updateCartCount) updateCartCount();
      navigate('/cart');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể mua ngay');
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.info('Vui lòng đăng nhập để thêm vào giỏ hàng!');
      navigate('/login');
      return;
    }
    if (!product || product.countInStock <= 0) return;
    try {
      await cartService.addToCart(product._id, quantity);
      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
      if (updateCartCount) updateCartCount();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Thêm vào giỏ hàng thất bại');
    }
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
    <>
      {/* Section header */}
      <div className="max-w-6xl mx-auto mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-green-800 flex items-center gap-2">
          <span className="inline-block border-l-4 border-green-500 pl-3">
            Thông tin chi tiết sản phẩm: <span className="text-green-700">{product.name}</span>
          </span>
        </h2>
      </div>
      <div className="bg-gray-50 min-h-screen py-10 px-4">
        {/* Thông tin chính */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-lg p-8 border border-green-100">
          {/* SwiperJS Carousel nâng cao */}
          <div className="w-full">
            <div className="relative">
              <Swiper
                modules={[Navigation, Pagination, Thumbs, A11y]}
                navigation
                pagination={{ clickable: true }}
                loop={images.length > 1}
                thumbs={{ swiper: thumbsSwiper }}
                className="rounded-xl shadow-lg overflow-hidden border border-gray-200"
                style={{ minHeight: 360 }}
              >
                {images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="relative group">
                      <img
                        src={img || DEFAULT_IMAGE}
                        alt={product.name}
                        className="w-full h-96 object-cover rounded-xl bg-gray-100 transition-transform duration-300 group-hover:scale-105"
                        onError={e => { e.target.src = DEFAULT_IMAGE; }}
                      />
                      {/* Wishlist icon */}
                      <button
                        onClick={handleToggleWishlist}
                        className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-3 shadow hover:bg-red-100 transition z-10 border border-gray-200"
                        title={isWishlisted ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
                        disabled={!user}
                      >
                        {isWishlisted ? (
                          <FaHeart className="text-red-500 text-2xl drop-shadow" />
                        ) : (
                          <FaRegHeart className="text-gray-400 text-2xl drop-shadow" />
                        )}
                      </button>
                      {!user && (
                        <span className="absolute top-4 right-16 bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs shadow">Đăng nhập để yêu thích</span>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Thumbs */}
              {images.length > 1 && (
                <Swiper
                  modules={[Thumbs]}
                  onSwiper={setThumbsSwiper}
                  slidesPerView={Math.min(images.length, 5)}
                  spaceBetween={10}
                  watchSlidesProgress
                  className="mt-4"
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={img || DEFAULT_IMAGE}
                        alt={`thumb-${idx}`}
                        className="w-20 h-20 object-cover rounded border-2 border-gray-200 cursor-pointer hover:border-green-500 transition"
                        onError={e => { e.target.src = DEFAULT_IMAGE; }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="flex flex-col space-y-6 justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-green-700 mb-2 flex items-center gap-2">
                {product.name}
                {product.isOrganic && <span className="ml-2 badge badge-success text-xs">Hữu cơ</span>}
                {product.discount > 0 && <span className="ml-2 badge badge-error text-xs">Giảm giá</span>}
              </h1>
              <p className="text-gray-700 mb-1">Danh mục: <span className="font-medium">{product.category?.name || 'Không phân loại'}</span></p>
              <p className="text-gray-700 mb-1">Xuất xứ: <span className="font-medium">{product.origin || 'Không rõ'}</span></p>
              <p className="text-gray-700 mb-1">Nhà cung cấp: <span className="font-medium">{product.user?.name || 'Không rõ'}</span></p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500 text-xl">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
                <span className="text-gray-500">({product.numReviews} đánh giá)</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2 flex items-end gap-3">
                {product.discount > 0 ? (
                  <>
                    <span className="text-red-600 animate-pulse">{(product.price * (1 - product.discount / 100)).toLocaleString()}₫</span>
                    <span className="ml-2 text-gray-500 line-through text-lg">{product.price.toLocaleString()}₫</span>
                    <span className="ml-2 text-sm bg-red-100 text-red-600 rounded px-2 py-1">-{product.discount}%</span>
                  </>
                ) : (
                  <>{product.price.toLocaleString()}₫</>
                )}
                <span className="text-base text-gray-500 font-normal">/ {product.unit?.name || product.unit || 'kg'}</span>
              </div>
              <p className="text-gray-600 mb-4 text-lg italic border-l-4 border-green-200 pl-4">{product.description}</p>
              {/* Số lượng và tổng giá */}
              <div className="flex items-center gap-4 mb-4">
                <span className="font-medium">Số lượng:</span>
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-lg border border-gray-200"
                  disabled={quantity <= 1}
                >
                  <FaMinus />
                </button>
                <input
                  type="number"
                  min={1}
                  max={product.countInStock}
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, Math.min(product.countInStock, Number(e.target.value))))}
                  className="w-16 text-center border border-green-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-200"
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-lg border border-gray-200"
                  disabled={quantity >= product.countInStock}
                >
                  <FaPlus />
                </button>
                <span className="ml-4 text-gray-600">Còn lại: <span className="font-semibold text-orange-600">{product.countInStock}</span></span>
              </div>
              <div className="text-lg font-semibold text-green-700 mb-4">
                Tổng: <span className="text-2xl text-green-900">{totalPrice.toLocaleString()}₫</span>
              </div>
              {product.countInStock <= 0 ? (
                <div className="text-red-500 font-medium mb-2">Hết hàng</div>
              ) : product.countInStock < 10 ? (
                <div className="text-orange-500 font-medium mb-2">Chỉ còn {product.countInStock} sản phẩm</div>
              ) : null}
            </div>
            <div className="flex items-center space-x-4 mt-4">
              {user ? (
                <>
                  <button
                    onClick={handleAddToCart}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-bold transition disabled:opacity-50 shadow-lg"
                    disabled={product.countInStock <= 0}
                  >
                    Thêm vào giỏ hàng
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg text-lg font-bold transition disabled:opacity-50 shadow-lg"
                    disabled={product.countInStock <= 0}
                  >
                    Mua ngay
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg text-lg font-bold transition shadow-lg"
                >
                  Đăng nhập để mua hàng
                </button>
              )}
              <button
                onClick={() => navigate('/products')}
                className="text-green-700 hover:underline text-lg"
              >
                ← Quay lại
              </button>
            </div>
          </div>
        </div>

        {/* Phần đánh giá */}
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow mt-10 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Đánh giá sản phẩm</h2>
          {(!product.reviews || product.reviews.length === 0) && <p className="text-gray-600">Chưa có đánh giá.</p>}
          {product.reviews && product.reviews.map((r) => (
            <div key={r._id || r.user} className="border-b border-gray-200 py-4">
              <p className="font-semibold">{r.name} <span className="text-sm text-gray-500">({new Date(r.createdAt).toLocaleDateString()})</span></p>
              <div className="flex items-center mb-2">
                <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                <span className="ml-2 text-gray-500">({r.rating}/5)</span>
              </div>
              <p className="text-gray-700">{r.comment}</p>
            </div>
          ))}
          {user ? (
            product.reviews && product.reviews.some((r) => r.user === user._id) ? (
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

        {/* Sản phẩm cùng danh mục */}
        {relatedProducts.length > 0 && (
          <div className="max-w-6xl mx-auto mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sản phẩm cùng danh mục</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} showWishlist={true} showAddToCart={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetailPage;
