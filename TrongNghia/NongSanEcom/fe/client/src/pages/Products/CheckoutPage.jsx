import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCreditCard, FaMoneyBillWave, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope, FaTruck, FaShieldAlt, FaStar } from 'react-icons/fa';
import { useUser } from '../../UserContext';
import cartService from '../../services/cartService';
import orderService from '../../services/orderService';
import Spinner from '../../components/Spinner';
import PageTitle from '../../components/PageTitle';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, updateCartCount } = useUser();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [customAddress, setCustomAddress] = useState({
    street: '',
    city: '',
    district: '',
    ward: '',
    postalCode: '',
    country: 'Vietnam'
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
    // Set default address
    if (user.addresses && user.addresses.length > 0) {
      const defaultAddress = user.addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
      } else {
        setSelectedAddressId(user.addresses[0]._id);
      }
    }
  }, [user, navigate]);

  const fetchCart = async () => {
    try {
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (error) {
      toast.error('Không thể tải giỏ hàng');
      navigate('/cart');
    }
  };

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

  const getSelectedAddress = () => {
    if (useCustomAddress) {
      return customAddress;
    }
    if (user.addresses && selectedAddressId) {
      return user.addresses.find(addr => addr._id === selectedAddressId);
    }
    return null;
  };

  const validateForm = () => {
    if (!paymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return false;
    }

    const address = getSelectedAddress();
    if (!address) {
      toast.error('Vui lòng chọn địa chỉ giao hàng');
      return false;
    }

    if (useCustomAddress) {
      if (!customAddress.street || !customAddress.city || !customAddress.district || !customAddress.ward) {
        toast.error('Vui lòng điền đầy đủ thông tin địa chỉ');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const orderData = {
        paymentMethod,
        shippingAddress: getSelectedAddress()
      };

      const order = await orderService.createOrder(orderData);
      updateCartCount();
      
      toast.success('Đặt hàng thành công!');
      navigate(`/orders/${order._id}`);
    } catch (error) {
      toast.error('Đặt hàng thất bại: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Spinner />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-6">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Mua sắm ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <PageTitle title="Thanh toán" description="Hoàn tất đơn hàng của bạn" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FaUser className="text-green-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Thông tin khách hàng</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                  <input
                    type="text"
                    value={user.name}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    value={user.phone || 'Chưa cập nhật'}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FaMapMarkerAlt className="text-green-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Địa chỉ giao hàng</h2>
              </div>

              {user.addresses && user.addresses.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Chọn địa chỉ có sẵn
                  </label>
                  <div className="space-y-3">
                    {user.addresses.map((address) => (
                      <label key={address._id} className="relative">
                        <input
                          type="radio"
                          name="address"
                          value={address._id}
                          checked={selectedAddressId === address._id && !useCustomAddress}
                          onChange={() => {
                            setSelectedAddressId(address._id);
                            setUseCustomAddress(false);
                          }}
                          className="sr-only"
                        />
                        <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedAddressId === address._id && !useCustomAddress
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <div className="font-medium text-gray-900">
                                  {address.street}, {address.ward}, {address.district}, {address.city}
                                </div>
                                {address.isDefault && (
                                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <FaStar className="w-3 h-3 mr-1" />
                                    Mặc định
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {address.postalCode} - {address.country}
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-3 ${
                              selectedAddressId === address._id && !useCustomAddress
                                ? 'border-green-500 bg-green-500'
                                : 'border-gray-300'
                            }`}>
                              {selectedAddressId === address._id && !useCustomAddress && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCustomAddress}
                    onChange={(e) => setUseCustomAddress(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Sử dụng địa chỉ khác
                  </span>
                </label>
              </div>

              {useCustomAddress && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đường/Phố *</label>
                    <input
                      type="text"
                      value={customAddress.street}
                      onChange={(e) => setCustomAddress({...customAddress, street: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nhập tên đường/phố"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã *</label>
                    <input
                      type="text"
                      value={customAddress.ward}
                      onChange={(e) => setCustomAddress({...customAddress, ward: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nhập phường/xã"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện *</label>
                    <input
                      type="text"
                      value={customAddress.district}
                      onChange={(e) => setCustomAddress({...customAddress, district: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nhập quận/huyện"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố *</label>
                    <input
                      type="text"
                      value={customAddress.city}
                      onChange={(e) => setCustomAddress({...customAddress, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nhập tỉnh/thành phố"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã bưu điện</label>
                    <input
                      type="text"
                      value={customAddress.postalCode}
                      onChange={(e) => setCustomAddress({...customAddress, postalCode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nhập mã bưu điện"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quốc gia</label>
                    <input
                      type="text"
                      value={customAddress.country}
                      onChange={(e) => setCustomAddress({...customAddress, country: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FaCreditCard className="text-green-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Phương thức thanh toán</h2>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex items-center flex-1">
                    <FaMoneyBillWave className="text-green-600 mr-3 text-xl" />
                    <div>
                      <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                      <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</div>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="VNPAY"
                    checked={paymentMethod === 'VNPAY'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex items-center flex-1">
                    <FaCreditCard className="text-blue-600 mr-3 text-xl" />
                    <div>
                      <div className="font-medium">Thanh toán qua VNPAY</div>
                      <div className="text-sm text-gray-500">Thanh toán trực tuyến an toàn qua VNPAY</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
              
              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {cart?.items?.map((item) => (
                  <div key={item.product._id} className="flex items-center space-x-3">
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
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(calculateSubtotal())}₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển:</span>
                  <span>{calculateShipping() === 0 ? 'Miễn phí' : formatPrice(calculateShipping()) + '₫'}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-green-600">{formatPrice(calculateTotal())}₫</span>
                </div>
              </div>

              {/* Security Info */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center text-green-800">
                  <FaShieldAlt className="mr-2" />
                  <span className="text-sm font-medium">Thanh toán an toàn</span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  Thông tin của bạn được bảo mật và mã hóa
                </p>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleSubmit}
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
              
              <div className="mt-4 text-xs text-gray-500 text-center">
                Bằng việc đặt hàng, bạn đồng ý với các điều khoản và điều kiện của chúng tôi
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 