import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../../UserContext';
import cartService from '../../services/cartService';
import ProductCard from '../../components/ProductCard';
import Header from '../../components/Header';

const CartPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      toast.info('Vui lòng đăng nhập để xem giỏ hàng!');
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

  const handleCheckout = () => {
    // Chuyển hướng sang trang thanh toán (có thể là /checkout hoặc /orders)
    navigate('/checkout');
  };

  if (!user) return null;
  if (loading) return <><Header /><div className="text-center py-10">Đang tải giỏ hàng...</div></>;
  if (error) return <><Header /><div className="text-center text-red-500 py-10">{error}</div></>;

  const items = cart?.items || [];
  const total = cartService.calculateCartTotal(cart);

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-green-100">
          <h1 className="text-3xl font-bold text-green-700 mb-6">Giỏ hàng của bạn</h1>
          {items.length === 0 ? (
            <div className="text-gray-600 text-lg">Giỏ hàng trống.</div>
          ) : (
            <>
              <div className="space-y-6 mb-8">
                {items.map(item => (
                  <div key={item.product._id} className="flex items-center gap-4 border-b pb-4">
                    <img src={item.product.images?.[0] || 'https://source.unsplash.com/100x100/?fruit,vegetable'} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{item.product.name}</div>
                      <div className="text-gray-500">{item.product.price.toLocaleString()}₫ x {item.quantity}</div>
                    </div>
                    <div className="font-bold text-green-700 text-lg">{(item.product.price * item.quantity).toLocaleString()}₫</div>
                  </div>
                ))}
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage; 