import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../../UserContext';
import cartService from '../../services/cartService';
import Spinner from '../../components/Spinner';
import { FaShoppingCart, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';

const CartPage = () => {
  const { user, updateCartCount } = useUser();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removing, setRemoving] = useState('');
  const [clearing, setClearing] = useState(false);
  const [updatingQty, setUpdatingQty] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchCart = async () => {
      setLoading(true);
      try {
        const data = await cartService.getCart();
        setCart(data);
      } catch (err) {
        setError('Không thể tải giỏ hàng');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user, navigate]);

  const handleRemove = async (productId) => {
    setRemoving(productId);
    try {
      await cartService.removeFromCart(productId);
      const data = await cartService.getCart();
      setCart(data);
      updateCartCount && updateCartCount();
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch {
      toast.error('Xóa sản phẩm thất bại');
    } finally {
      setRemoving('');
    }
  };

  const handleClear = async () => {
    setClearing(true);
    try {
      await cartService.clearCart();
      setCart({ items: [] });
      updateCartCount && updateCartCount();
      toast.success('Đã xóa toàn bộ giỏ hàng');
    } catch {
      toast.error('Xóa giỏ hàng thất bại');
    } finally {
      setClearing(false);
    }
  };

  const handleUpdateQty = async (productId, newQty, maxQty) => {
    if (newQty < 1 || newQty > maxQty) return;
    setUpdatingQty(productId);
    try {
      await cartService.updateCartItem(productId, newQty);
      const data = await cartService.getCart();
      setCart(data);
      updateCartCount && updateCartCount();
    } catch {
      toast.error('Cập nhật số lượng thất bại');
    } finally {
      setUpdatingQty('');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!user) return null;
  if (loading) return <Spinner text="Đang tải giỏ hàng..." />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  const items = cart?.items || [];
  // Tính giá hiện tại (có discount)
  const getCurrentPrice = (product) => {
    if (!product) return 0;
    return product.discount > 0
      ? Math.round(product.price * (1 - product.discount / 100))
      : product.price;
  };
  const total = items.reduce((sum, item) => sum + getCurrentPrice(item.product) * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-16">
        <FaShoppingCart className="text-7xl text-gray-300 mb-6" />
        <div className="text-2xl font-semibold text-gray-700 mb-2">Giỏ hàng của bạn đang trống</div>
        <div className="text-gray-500 mb-6">Hãy thêm sản phẩm để bắt đầu mua sắm!</div>
        <button
          onClick={() => navigate('/products')}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-bold transition"
        >
          <FaArrowLeft className="inline mr-2" /> Quay lại mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-green-100">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Giỏ hàng của bạn</h1>
        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-700 font-medium">Tổng số sản phẩm: {items.reduce((sum, i) => sum + i.quantity, 0)}</div>
          <button
            onClick={handleClear}
            className="text-red-600 hover:underline text-sm disabled:opacity-50"
            disabled={clearing}
          >
            {clearing ? 'Đang xóa...' : 'Xóa toàn bộ giỏ hàng'}
          </button>
        </div>
        <div className="divide-y divide-gray-200 mb-8">
          {items.map(item => {
            const price = getCurrentPrice(item.product);
            const maxQty = item.product.countInStock;
            return (
              <div key={item.product._id} className="flex flex-col sm:flex-row items-center gap-4 py-4">
                <img src={item.product.images?.[0] || 'https://source.unsplash.com/100x100/?fruit,vegetable'} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1 w-full">
                  <div className="font-semibold text-lg">{item.product.name}</div>
                  <div className="text-gray-500 text-sm">Đơn giá: <span className="font-medium text-green-700">{price.toLocaleString()}₫</span></div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleUpdateQty(item.product._id, item.quantity - 1, maxQty)}
                      className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-lg border border-gray-200 disabled:opacity-50"
                      disabled={item.quantity <= 1 || updatingQty === item.product._id}
                    >
                      <FaMinus />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={maxQty}
                      value={item.quantity}
                      onChange={e => {
                        const val = Number(e.target.value);
                        if (val >= 1 && val <= maxQty) handleUpdateQty(item.product._id, val, maxQty);
                      }}
                      className="w-16 text-center border border-green-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-200"
                      disabled={updatingQty === item.product._id}
                    />
                    <button
                      onClick={() => handleUpdateQty(item.product._id, item.quantity + 1, maxQty)}
                      className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-lg border border-gray-200 disabled:opacity-50"
                      disabled={item.quantity >= maxQty || updatingQty === item.product._id}
                    >
                      <FaPlus />
                    </button>
                    <span className="ml-2 text-xs text-gray-400">Còn lại: {maxQty}</span>
                  </div>
                </div>
                <div className="font-bold text-green-700 text-lg min-w-[100px] text-right">{(price * item.quantity).toLocaleString()}₫</div>
                <button
                  onClick={() => handleRemove(item.product._id)}
                  className="ml-2 text-red-500 hover:underline text-sm disabled:opacity-50"
                  disabled={removing === item.product._id || updatingQty === item.product._id}
                >
                  {removing === item.product._id ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-semibold">Tổng cộng:</div>
          <div className="text-2xl font-bold text-green-700">{total.toLocaleString()}₫</div>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-lg text-lg font-bold transition"
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default CartPage; 