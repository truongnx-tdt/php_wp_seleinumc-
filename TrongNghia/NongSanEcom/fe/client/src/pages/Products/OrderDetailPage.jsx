import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTruck, FaCreditCard, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useUser } from '../../UserContext';
import orderService from '../../services/orderService';
import Spinner from '../../components/Spinner';
import PageTitle from '../../components/PageTitle';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrder();
  }, [id, user, navigate]);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrderById(id);
      setOrder(data);
    } catch (err) {
      setError('Không thể tải thông tin đơn hàng');
      toast.error('Không thể tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Processing':
        return 'text-blue-600 bg-blue-100';
      case 'Shipped':
        return 'text-purple-600 bg-purple-100';
      case 'Delivered':
        return 'text-green-600 bg-green-100';
      case 'Cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Pending':
        return 'Chờ xử lý';
      case 'Processing':
        return 'Đang xử lý';
      case 'Shipped':
        return 'Đang giao hàng';
      case 'Delivered':
        return 'Đã giao hàng';
      case 'Cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getPaymentStatus = () => {
    if (order.isPaid) {
      return { text: 'Đã thanh toán', color: 'text-green-600 bg-green-100' };
    }
    return { text: 'Chưa thanh toán', color: 'text-red-600 bg-red-100' };
  };

  if (!user) return null;
  if (loading) return <Spinner text="Đang tải thông tin đơn hàng..." />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!order) return <div className="text-center text-red-500 py-10">Không tìm thấy đơn hàng</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <PageTitle title={`Đơn hàng #${order._id.slice(-8)}`} description="Chi tiết đơn hàng của bạn" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Đơn hàng #{order._id.slice(-8)}
              </h1>
              <p className="text-gray-600">
                Đặt hàng lúc {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatus().color}`}>
                {getPaymentStatus().text}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sản phẩm đã đặt</h2>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">Số lượng: {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(item.price)}₫</p>
                      <p className="text-sm text-gray-500">Tổng: {formatPrice(item.price * item.qty)}₫</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FaMapMarkerAlt className="text-green-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Địa chỉ giao hàng</h2>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 font-medium">
                  {order.shippingAddress.street}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress.ward}, {order.shippingAddress.district}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                <p className="text-gray-600">{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FaCreditCard className="text-green-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Thông tin thanh toán</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức thanh toán:</span>
                  <span className="font-medium">
                    {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Thanh toán qua VNPAY'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái thanh toán:</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getPaymentStatus().color}`}>
                    {getPaymentStatus().text}
                  </span>
                </div>
                {order.isPaid && order.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày thanh toán:</span>
                    <span className="font-medium">{formatDate(order.paidAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(order.itemsPrice)}₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>{order.shippingPrice === 0 ? 'Miễn phí' : formatPrice(order.shippingPrice) + '₫'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thuế:</span>
                  <span>{formatPrice(order.taxPrice)}₫</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-green-600">{formatPrice(order.totalPrice)}₫</span>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-3">Lịch sử đơn hàng</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Đơn hàng đã được tạo</p>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  {order.isPaid && (
                    <div className="flex items-start">
                      <FaCreditCard className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Đã thanh toán</p>
                        <p className="text-xs text-gray-500">{formatDate(order.paidAt)}</p>
                      </div>
                    </div>
                  )}
                  
                  {order.isDelivered && (
                    <div className="flex items-start">
                      <FaTruck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Đã giao hàng</p>
                        <p className="text-xs text-gray-500">{formatDate(order.deliveredAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate('/products')}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
                >
                  Tiếp tục mua sắm
                </button>
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-300"
                >
                  Xem tất cả đơn hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage; 