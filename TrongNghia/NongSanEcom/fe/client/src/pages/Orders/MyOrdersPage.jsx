import React, { useEffect, useState } from 'react';
import PageTitle from '../../components/PageTitle';
import api from '../../utils/axiosInstance';
import { FaCheckCircle, FaTimesCircle, FaShippingFast, FaClock, FaMoneyBillWave, FaBan } from 'react-icons/fa';

const STATUS_ICON = {
  Pending: <FaClock className="text-yellow-500" title="Chờ xác nhận" />,
  Confirmed: <FaCheckCircle className="text-blue-500" title="Đã xác nhận" />,
  Shipping: <FaShippingFast className="text-purple-500" title="Đang giao" />,
  Delivered: <FaCheckCircle className="text-green-600" title="Đã nhận hàng" />,
  Cancelled: <FaBan className="text-red-500" title="Đã hủy" />,
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalPaid: 0, totalDelivered: 0, totalOrders: 0 });
  const [actionLoading, setActionLoading] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  useEffect(() => {
    fetchOrders(pagination.page);
    // eslint-disable-next-line
  }, [pagination.page]);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/orders/myorders?page=${page}`);
      const orders = res.data.orders || [];
      setOrders(orders);
      setPagination(res.data.pagination || { page: 1, totalPages: 1, total: orders.length });
      // Tính thống kê
      const totalPaid = orders.filter(o => o.isPaid).reduce((sum, o) => sum + o.totalPrice, 0);
      const totalDelivered = orders.filter(o => o.status === 'Delivered').length;
      setStats({
        totalPaid,
        totalDelivered,
        totalOrders: res.data.pagination?.total || orders.length
      });
    } catch {
      setOrders([]);
      setStats({ totalPaid: 0, totalDelivered: 0, totalOrders: 0 });
      setPagination({ page: 1, totalPages: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Thanh toán lại VNPAY
  const handleVNPay = async (order) => {
    setActionLoading(order._id);
    try {
      const vnpayData = {
        orderId: order._id,
        amount: Number(order.totalPrice),
        bankCode: '',
        language: 'vn'
      };
      const response = await fetch('http://localhost:8888/order/create_payment_url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vnpayData)
      });
      const result = await response.json();
      if (result.success && result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        alert(result.message || 'Không thể tạo URL thanh toán VNPAY');
      }
    } catch (err) {
      alert('Không thể tạo URL thanh toán VNPAY');
    } finally {
      setActionLoading('');
    }
  };

  // Hủy đơn hàng
  const handleCancel = async (order) => {
    if (!window.confirm('Bạn chắc chắn muốn hủy đơn hàng này?')) return;
    setActionLoading(order._id);
    try {
      await api.put(`/api/orders/${order._id}/status`, { status: 'Cancelled' });
      fetchOrders(pagination.page);
    } catch (err) {
      alert('Không thể hủy đơn hàng!');
    } finally {
      setActionLoading('');
    }
  };

  const formatPrice = (price) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  const formatDate = (date) => new Date(date).toLocaleDateString('vi-VN');
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-600';
      case 'Confirmed': return 'text-blue-600';
      case 'Shipping': return 'text-purple-600';
      case 'Delivered': return 'text-green-600';
      case 'Cancelled': return 'text-red-600';
      default: return 'text-gray-700';
    }
  };

  // Pagination controls
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== pagination.page) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-2 sm:px-4">
      <PageTitle title="Đơn hàng của tôi" description="Xem lịch sử mua hàng của bạn" />
      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 text-center shadow">
          <div className="text-lg font-semibold text-green-700">Tổng tiền đã mua</div>
          <div className="text-2xl font-bold mt-2">{formatPrice(stats.totalPaid)}</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center shadow">
          <div className="text-lg font-semibold text-blue-700">Đơn đã nhận</div>
          <div className="text-2xl font-bold mt-2">{stats.totalDelivered}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center shadow">
          <div className="text-lg font-semibold text-yellow-700">Tổng đơn đã đặt</div>
          <div className="text-2xl font-bold mt-2">{stats.totalOrders}</div>
        </div>
      </div>
      {/* Bảng đơn hàng */}
      {loading ? <div>Đang tải...</div> : (
        <div className="bg-white rounded shadow p-4 sm:p-6 overflow-x-auto">
          {orders.length === 0 ? <div>Bạn chưa có đơn hàng nào.</div> : (
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-2">#</th>
                  <th className="py-2 px-2">Mã đơn</th>
                  <th className="py-2 px-2">Ngày đặt</th>
                  <th className="py-2 px-2">Trạng thái</th>
                  <th className="py-2 px-2">Thanh toán</th>
                  <th className="py-2 px-2">Phương thức</th>
                  <th className="py-2 px-2">Tổng tiền</th>
                  <th className="py-2 px-2">Sản phẩm</th>
                  <th className="py-2 px-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={order._id} className="border-t hover:bg-green-50 transition-all">
                    <td className="py-2 px-2 text-gray-500">{(pagination.page - 1) * 10 + idx + 1}</td>
                    <td className="py-2 px-2 font-mono">{order._id.slice(-6).toUpperCase()}</td>
                    <td className="py-2 px-2">{formatDate(order.createdAt)}</td>
                    <td className={`py-2 px-2 font-semibold flex items-center gap-2 ${getStatusColor(order.status)}`}>{STATUS_ICON[order.status]} {order.status}</td>
                    <td className="py-2 px-2">
                      {order.isPaid ? <span className="text-green-600 font-medium flex items-center gap-1"><FaMoneyBillWave />Đã thanh toán</span> : <span className="text-red-600 font-medium">Chưa thanh toán</span>}
                    </td>
                    <td className="py-2 px-2">{order.paymentMethod}</td>
                    <td className="py-2 px-2">{formatPrice(order.totalPrice)}</td>
                    <td className="py-2 px-2">
                      <div className="flex -space-x-2">
                        {order.orderItems && order.orderItems.slice(0, 3).map((item, i) => (
                          <img
                            key={i}
                            src={item.image}
                            alt={item.name}
                            className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover"
                            title={item.name}
                          />
                        ))}
                        {order.orderItems && order.orderItems.length > 3 && (
                          <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-xs font-bold border-2 border-white">+{order.orderItems.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-2 space-x-2 whitespace-nowrap">
                      <a href={`/orders/${order._id}`} className="text-blue-600 hover:underline">Chi tiết</a>
                      {/* Nếu là VNPAY và chưa thanh toán */}
                      {order.paymentMethod === 'VNPAY' && !order.isPaid && order.status !== 'Cancelled' && (
                        <button
                          className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                          onClick={() => handleVNPay(order)}
                          disabled={actionLoading === order._id}
                        >
                          {actionLoading === order._id ? 'Đang chuyển...' : 'Thanh toán'}
                        </button>
                      )}
                      {/* Nếu chưa thanh toán và chưa bị hủy */}
                      {!order.isPaid && order.status !== 'Cancelled' && (
                        <button
                          className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                          onClick={() => handleCancel(order)}
                          disabled={actionLoading === order._id}
                        >
                          {actionLoading === order._id ? 'Đang hủy...' : 'Hủy đơn'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                className="px-3 py-1 rounded border bg-gray-50 hover:bg-gray-100"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                &lt;
              </button>
              {Array.from({ length: pagination.totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded border ${pagination.page === i + 1 ? 'bg-green-600 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
                  onClick={() => handlePageChange(i + 1)}
                  disabled={pagination.page === i + 1}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded border bg-gray-50 hover:bg-gray-100"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                &gt;
              </button>
              <span className="ml-4 text-gray-500 text-sm">Trang {pagination.page} / {pagination.totalPages} ({pagination.total} đơn)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage; 