import React from 'react';
import { FaTruck, FaShieldAlt } from 'react-icons/fa';
import Spinner from '../../../components/Spinner';

const OrderSummary = ({ cart, loading, onSubmit }) => {
  const getCurrentPrice = (product) => {
    if (product.discount > 0) {
      return product.price * (1 - product.discount / 100);
    }
    return product.price;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const calculateSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      const currentPrice = getCurrentPrice(item.product);
      return total + (currentPrice * item.quantity);
    }, 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 500000 ? 0 : 30000;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
      
      {/* Order Items */}
      <div className="space-y-3 mb-6">
        {cart?.items?.map((item) => (
          <OrderItem
            key={item.product._id}
            item={item}
            getCurrentPrice={getCurrentPrice}
            formatPrice={formatPrice}
          />
        ))}
      </div>

      {/* Price Breakdown */}
      <PriceBreakdown
        subtotal={calculateSubtotal()}
        shipping={calculateShipping()}
        total={calculateTotal()}
        formatPrice={formatPrice}
      />

      {/* Security Info */}
      <SecurityInfo />

      {/* Place Order Button */}
      <PlaceOrderButton loading={loading} onSubmit={onSubmit} />
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Bằng việc đặt hàng, bạn đồng ý với các điều khoản và điều kiện của chúng tôi
      </div>
    </div>
  );
};

const OrderItem = ({ item, getCurrentPrice, formatPrice }) => (
  <div className="flex items-center space-x-3">
    <img
      src={item.product.images?.[0]}
      alt={item.product.name}
      className="w-12 h-12 object-cover rounded"
    />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">
        {item.product.name}
      </p>
      <p className="text-sm text-gray-500">
        Số lượng: {item.quantity}
      </p>
    </div>
    <div className="text-sm font-medium text-gray-900">
      {formatPrice(getCurrentPrice(item.product) * item.quantity)}₫
    </div>
  </div>
);

const PriceBreakdown = ({ subtotal, shipping, total, formatPrice }) => (
  <div className="border-t pt-4 space-y-2">
    <div className="flex justify-between text-sm">
      <span>Tạm tính:</span>
      <span>{formatPrice(subtotal)}₫</span>
    </div>
    <div className="flex justify-between text-sm">
      <span>Phí vận chuyển:</span>
      <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping) + '₫'}</span>
    </div>
    <div className="border-t pt-2 flex justify-between font-semibold text-lg">
      <span>Tổng cộng:</span>
      <span className="text-green-600">{formatPrice(total)}₫</span>
    </div>
  </div>
);

const SecurityInfo = () => (
  <div className="mt-6 p-4 bg-green-50 rounded-lg">
    <div className="flex items-center text-green-800">
      <FaShieldAlt className="mr-2" />
      <span className="text-sm font-medium">Thanh toán an toàn</span>
    </div>
    <p className="text-xs text-green-700 mt-1">
      Thông tin của bạn được bảo mật và mã hóa
    </p>
  </div>
);

const PlaceOrderButton = ({ loading, onSubmit }) => (
  <button
    onClick={onSubmit}
    disabled={loading}
    className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 flex items-center justify-center"
  >
    {loading ? (
      <>
        <Spinner size="sm" />
        <span className="ml-2">Đang xử lý...</span>
      </>
    ) : (
      <>
        <FaTruck className="mr-2" />
        Đặt hàng ngay
      </>
    )}
  </button>
);

export default OrderSummary; 