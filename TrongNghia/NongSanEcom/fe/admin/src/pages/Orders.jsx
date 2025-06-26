import React, { useEffect, useState, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { API_ENDPOINTS, ORDER_STATUS } from '../constants';
import { PageHeader, DataTable, Button, Modal } from '../components/common';
import { toast } from 'react-toastify';
import { FaEye, FaFilter } from 'react-icons/fa';
import OrderFilterBar from './OrderFilterBar';

// Custom hook cho filter và pagination
function useOrderFilters(initial = {
  status: '',
  paymentMethod: '',
  dateFrom: '',
  dateTo: '',
  search: ''
}) {
  const [filters, setFilters] = useState(initial);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  return {
    filters,
    setFilters,
    pagination,
    setPagination,
    resetFilters: () => setFilters(initial)
  };
}

// Modal bộ lọc
function OrderFilterModal({ isOpen, onClose, filters, setFilters, onApply, onReset }) {
  const [temp, setTemp] = useState(filters);
  useEffect(() => { setTemp(filters); }, [filters, isOpen]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bộ lọc đơn hàng" size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
          <input type="text" value={temp.search} onChange={e => setTemp(f => ({ ...f, search: e.target.value }))} className="w-full px-3 py-2 border rounded-md" placeholder="Tìm theo mã đơn hàng, tên khách hàng..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <select value={temp.status} onChange={e => setTemp(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 border rounded-md">
            <option value="">Tất cả trạng thái</option>
            {Object.entries(ORDER_STATUS).map(([key, value]) => (
              <option key={key} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức thanh toán</label>
          <select value={temp.paymentMethod} onChange={e => setTemp(f => ({ ...f, paymentMethod: e.target.value }))} className="w-full px-3 py-2 border rounded-md">
            <option value="">Tất cả</option>
            <option value="COD">COD</option>
            <option value="VNPAY">VNPAY</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
            <input type="date" value={temp.dateFrom} onChange={e => setTemp(f => ({ ...f, dateFrom: e.target.value }))} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
            <input type="date" value={temp.dateTo} onChange={e => setTemp(f => ({ ...f, dateTo: e.target.value }))} className="w-full px-3 py-2 border rounded-md" />
          </div>
        </div>
        <div className="flex space-x-3 pt-4">
          <Button variant="secondary" onClick={() => { setTemp({ status: '', paymentMethod: '', dateFrom: '', dateTo: '', search: '' }); onReset && onReset(); }} className="flex-1">Xóa bộ lọc</Button>
          <Button variant="primary" onClick={() => { setFilters(temp); onApply && onApply(); onClose(); }} className="flex-1">Áp dụng</Button>
        </div>
      </div>
    </Modal>
  );
}

// Modal chi tiết đơn hàng
function OrderDetailModal({ order, isOpen, onClose }) {
  if (!order) return null;
  const formatPrice = v => v?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết đơn hàng" size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Thông tin đơn hàng</h3>
            <div className="mt-2 text-sm space-y-1">
              <div><b>Mã đơn hàng:</b> {order._id}</div>
              <div><b>Ngày đặt:</b> {new Date(order.createdAt).toLocaleString('vi-VN')}</div>
              <div><b>Trạng thái:</b> {order.status}</div>
              <div><b>Phương thức:</b> {order.paymentMethod}</div>
              <div><b>Thanh toán:</b> {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Khách hàng</h3>
            <div className="mt-2 text-sm space-y-1">
              <div><b>Tên:</b> {order.user?.name}</div>
              <div><b>Email:</b> {order.user?.email}</div>
              <div><b>SĐT:</b> {order.user?.phone || '-'}</div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Địa chỉ giao hàng</h3>
          <div className="bg-gray-50 p-3 rounded text-sm">
            {order.shippingAddress && (
              <div>
                {order.shippingAddress.street && <div>{order.shippingAddress.street}</div>}
                <div>{[order.shippingAddress.ward, order.shippingAddress.district, order.shippingAddress.city].filter(Boolean).join(', ')}</div>
                {order.shippingAddress.postalCode && <div>Mã bưu điện: {order.shippingAddress.postalCode}</div>}
              </div>
            )}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Sản phẩm đã đặt</h3>
          <div className="space-y-2">
            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600">Số lượng: {item.qty}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatPrice(item.price)}</div>
                  <div className="text-sm text-gray-600">Tổng: {formatPrice(item.price * item.qty)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t pt-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Tổng tiền hàng:</span><span>{formatPrice(order.itemsPrice)}</span></div>
            <div className="flex justify-between"><span>Phí vận chuyển:</span><span>{formatPrice(order.shippingPrice)}</span></div>
            <div className="flex justify-between"><span>Thuế:</span><span>{formatPrice(order.taxPrice)}</span></div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2"><span>Tổng cộng:</span><span>{formatPrice(order.totalPrice)}</span></div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// Badge trạng thái
const getStatusBadge = status => {
  const map = {
    [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
    [ORDER_STATUS.CONFIRMED]: 'bg-blue-100 text-blue-800',
    [ORDER_STATUS.SHIPPING]: 'bg-purple-100 text-purple-800',
    [ORDER_STATUS.DELIVERED]: 'bg-green-100 text-green-800',
    [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
  };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${map[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};
const getPaymentStatusBadge = isPaid => <span className={`px-2 py-1 text-xs font-medium rounded-full ${isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>;

// Table row
function OrderTableRow({ order, index, onView, onStatusUpdate, statusOptions, onUpdatePaid }) {
  const handleTogglePaid = () => {
    const nextPaid = !order.isPaid;
    const msg = nextPaid ? 'Xác nhận chuyển sang ĐÃ THANH TOÁN cho đơn hàng này?' : 'Xác nhận chuyển sang CHƯA THANH TOÁN cho đơn hàng này?';
    if (window.confirm(msg)) {
      onUpdatePaid(order._id, nextPaid);
    }
  };
  return (
    <tr>
      <td className="py-3 px-4 text-gray-500">{index + 1}</td>
      <td className="py-3 px-4 font-mono text-sm">{order._id}</td>
      <td className="py-3 px-4">{order.user?.name || order.user?.email || '-'}</td>
      <td className="py-3 px-4">{order.totalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
      <td className="py-3 px-4">{order.paymentMethod === 'VNPAY' ? 'VNPAY' : 'COD'}</td>
      <td className="py-3 px-4 flex items-center gap-2">
        {getPaymentStatusBadge(order.isPaid)}
        {order.paymentMethod === 'COD' && (
          <button
            className={`ml-2 px-3 py-1 rounded text-xs font-semibold transition-colors ${order.isPaid ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-700 hover:bg-yellow-400'}`}
            onClick={handleTogglePaid}
          >
            {order.isPaid ? 'Đánh dấu chưa thanh toán' : 'Đánh dấu đã thanh toán'}
          </button>
        )}
      </td>
      <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
      <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
      <td className="py-3 px-4">{order.lastModifiedBy ? (order.lastModifiedBy.name || order.lastModifiedBy.email) : '-'}</td>
      <td className="py-3 px-4 text-center">
        <Button variant="secondary" size="sm" onClick={() => onView(order)}><FaEye className="w-4 h-4" /></Button>
        {order.isPaid && statusOptions.length > 0 && (
          <select className="ml-2 px-2 py-1 text-sm border rounded" onChange={e => onStatusUpdate(order._id, e.target.value)} defaultValue="">
            <option value="" disabled>Cập nhật</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
        )}
      </td>
    </tr>
  );
}

// Main page
const Orders = () => {
  const { get, put, loading, error } = useApi();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Sử dụng useState và useCallback để giữ reference ổn định
  const [filters, setFiltersState] = useState({
    status: '',
    paymentMethod: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });
  const setFilters = useCallback((updater) => {
    setFiltersState(prev => typeof updater === 'function' ? updater(prev) : updater);
  }, []);

  const [pagination, setPaginationState] = useState({ page: 1, limit: 10, total: 0 });
  const setPagination = useCallback((updater) => {
    setPaginationState(prev => typeof updater === 'function' ? updater(prev) : updater);
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState({ status: '', paymentMethod: '', dateFrom: '', dateTo: '', search: '' });
  }, []);

  // Lấy danh sách đơn hàng
  const fetchOrders = useCallback(async () => {
    const params = new URLSearchParams({ page: pagination.page, limit: pagination.limit, ...filters });
    const data = await get(`${API_ENDPOINTS.ORDERS.LIST}?${params}`);
    setOrders(Array.isArray(data) ? data : data.orders || []);
    setPagination(prev => ({ ...prev, total: data.pagination?.total || data.orders?.length || 0 }));
  }, [get, filters, pagination.page, pagination.limit, setPagination]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Cập nhật trạng thái đơn hàng
  const handleStatusUpdate = async (orderId, newStatus) => {
    await put(API_ENDPOINTS.ORDERS.UPDATE_STATUS(orderId), { status: newStatus });
    toast.success('Cập nhật trạng thái đơn hàng thành công');
    fetchOrders();
  };

  // Cập nhật trạng thái thanh toán
  const handleUpdatePaid = async (orderId, isPaid) => {
    await put(API_ENDPOINTS.ORDERS.UPDATE_TO_PAID(orderId), {
      id: orderId,
      isPaid: isPaid,
      update_time: new Date().toISOString(),
    });
    toast.success('Cập nhật trạng thái thanh toán thành công');
    fetchOrders();
  };

  // Xem chi tiết đơn hàng
  const handleViewOrder = order => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // Các trạng thái chuyển đổi hợp lệ
  const getStatusOptions = status => {
    const map = {
      [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.SHIPPING, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.SHIPPING]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.DELIVERED]: [],
      [ORDER_STATUS.CANCELLED]: [],
    };
    return map[status] || [];
  };

  // Cột bảng
  const columns = [
    { key: 'index', header: 'STT' },
    { key: '_id', header: 'Mã đơn hàng' },
    { key: 'user', header: 'Khách hàng' },
    { key: 'totalPrice', header: 'Tổng tiền' },
    { key: 'paymentMethod', header: 'Phương thức' },
    { key: 'isPaid', header: 'Thanh toán' },
    { key: 'status', header: 'Trạng thái' },
    { key: 'createdAt', header: 'Ngày đặt' },
    { key: 'lastModifiedBy', header: 'Người sửa', render: (v, row) => row.lastModifiedBy ? (row.lastModifiedBy.name || row.lastModifiedBy.email) : '-' },
    { key: 'actions', header: 'Hành động', align: 'center' },
  ];

  // Render từng dòng bảng
  const renderRow = (row, _, idx) => (
    <OrderTableRow
      key={row._id}
      order={row}
      index={idx + (pagination.page - 1) * pagination.limit}
      onView={handleViewOrder}
      onStatusUpdate={handleStatusUpdate}
      statusOptions={getStatusOptions(row.status)}
      onUpdatePaid={handleUpdatePaid}
    />
  );

  return (
    <div className="mx-auto">
      <PageHeader
        title="Quản lý đơn hàng"
        subtitle="Theo dõi và quản lý tất cả đơn hàng trong hệ thống"
      />
      <OrderFilterBar filters={filters} setFilters={setFilters} setPagination={setPagination} resetFilters={resetFilters} />
      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        error={error}
        emptyMessage="Chưa có đơn hàng nào."
        onPageChange={page => setPagination(prev => ({ ...prev, page }))}
        currentPage={pagination.page}
        totalPages={Math.ceil(pagination.total / pagination.limit)}
        totalItems={pagination.total}
        itemsPerPage={pagination.limit}
        showIndex={false}
        onRowDoubleClick={null}
        onRowClick={null}
        renderRow={renderRow}
      />
      <OrderDetailModal order={selectedOrder} isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} />
    </div>
  );
};

export default Orders; 