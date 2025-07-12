import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../../UserContext';
import cartService from '../../services/cartService';
import orderService from '../../services/orderService';
import { userService } from '../../services/userService';
import Spinner from '../../components/Spinner';
import PageTitle from '../../components/PageTitle';
import CustomerInfo from './components/CustomerInfo';
import ShippingAddress from './components/ShippingAddress';
import PaymentMethod from './components/PaymentMethod';
import OrderSummary from './components/OrderSummary';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, updateCartCount, updateUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [saveNewAddress, setSaveNewAddress] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
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
    setDefaultAddress();
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

  const setDefaultAddress = () => {
    if (user.addresses && user.addresses.length > 0) {
      const defaultAddress = user.addresses.find(addr => addr.isDefault);
      setSelectedAddressId(defaultAddress ? defaultAddress._id : user.addresses[0]._id);
    }
  };

  const getSelectedAddress = () => {
    if (useCustomAddress) return customAddress;
    if (user.addresses && selectedAddressId) {
      return user.addresses.find(addr => addr._id === selectedAddressId);
    }
    return null;
  };

  const validateForm = () => {
    setShowValidationErrors(true);
    
    if (!paymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return false;
    }

    // Kiểm tra xem user có địa chỉ nào không
    if (!user.addresses || user.addresses.length === 0) {
      if (!useCustomAddress) {
        toast.error('Bạn chưa có địa chỉ giao hàng. Vui lòng điền địa chỉ mới.');
        return false;
      }
    }

    const address = getSelectedAddress();
    if (!address) {
      toast.error('Vui lòng chọn địa chỉ giao hàng');
      return false;
    }

    if (useCustomAddress) {
      const requiredFields = ['street', 'city', 'district', 'ward', 'postalCode'];
      const missingFields = requiredFields.filter(field => !customAddress[field] || customAddress[field].trim() === '');
      
      if (missingFields.length > 0) {
        const fieldNames = {
          street: 'đường/phố',
          city: 'tỉnh/thành phố',
          district: 'quận/huyện',
          ward: 'phường/xã',
          postalCode: 'mã bưu điện'
        };
        
        const missingFieldNames = missingFields.map(field => fieldNames[field]).join(', ');
        toast.error(`Vui lòng điền đầy đủ thông tin: ${missingFieldNames}`);
        return false;
      }
    } else {
      // Kiểm tra nếu user chọn địa chỉ có sẵn nhưng không có địa chỉ nào
      if (!selectedAddressId) {
        toast.error('Vui lòng chọn địa chỉ giao hàng');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form trước khi call API
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      // Kiểm tra tồn kho trước
      await orderService.checkInventory();

      // Nếu user muốn lưu địa chỉ mới vào profile
      if (saveNewAddress && useCustomAddress) {
        try {
          const updatedAddresses = await userService.addAddress({
            ...customAddress,
            isDefault: false
          });
          // Cập nhật user context với địa chỉ mới
          updateUser({ ...user, addresses: updatedAddresses });
          toast.success('Đã lưu địa chỉ mới vào profile');
        } catch (error) {
          console.error('Lỗi khi lưu địa chỉ:', error);
          toast.error('Không thể lưu địa chỉ vào profile, nhưng vẫn tiếp tục đặt hàng');
        }
      }

      const orderData = {
        paymentMethod,
        ...(useCustomAddress && { shippingAddress: customAddress }),
        ...(selectedAddressId && !useCustomAddress && { shippingAddressId: selectedAddressId })
      };

      const order = await orderService.createOrder(orderData);

      // Nếu thanh toán bằng VNPAY, chuyển hướng đến trang thanh toán
      if (paymentMethod === 'VNPAY') {
        const vnpayData = {
          orderId: order._id,
          amount: Number(order.totalPrice),
          bankCode: '',
          language: 'vn'
        };

        // Gọi API VNPAY để tạo URL thanh toán
        const response = await fetch('http://localhost:8888/order/create_payment_url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(vnpayData)
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.paymentUrl) {
            // Chuyển hướng đến trang thanh toán VNPAY
            window.location.href = result.paymentUrl;
          } else {
            throw new Error('Không thể tạo URL thanh toán VNPAY');
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Không thể tạo URL thanh toán VNPAY');
        }
      } else {
        // Thanh toán COD - chuyển đến trang thành công
        updateCartCount(0);
        navigate(`/orders/${order._id}`);
        toast.success('Đặt hàng thành công!');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi đặt hàng');
    } finally {
      setLoading(false);
    }
  };



  const handleAddressSelection = (addressId) => {
    setSelectedAddressId(addressId);
    setUseCustomAddress(false);
  };

  const handleCustomAddressToggle = (checked) => {
    setUseCustomAddress(checked);
    if (!checked) {
      setDefaultAddress();
    }
  };

  if (!user) return <Spinner />;

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
            <CustomerInfo user={user} />

            <ShippingAddress
              user={user}
              selectedAddressId={selectedAddressId}
              useCustomAddress={useCustomAddress}
              customAddress={customAddress}
              saveNewAddress={saveNewAddress}
              onAddressSelection={handleAddressSelection}
              onCustomAddressToggle={handleCustomAddressToggle}
              onCustomAddressChange={setCustomAddress}
              onSaveNewAddressChange={setSaveNewAddress}
              showError={showValidationErrors}
            />

            <PaymentMethod
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              showError={showValidationErrors}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              cart={cart}
              loading={loading}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 