import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { API_ENDPOINTS, ORDER_STATUS } from '../constants';
import { PageHeader, DataTable, Button } from '../components/common';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { get, put, loading, error } = useApi();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await get(API_ENDPOINTS.ORDERS.LIST);
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await put(API_ENDPOINTS.ORDERS.UPDATE_STATUS(orderId), { status: newStatus });
      toast.success('Cập nhật trạng thái đơn hàng thành công');
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      [ORDER_STATUS.PENDING]: { label: 'Chờ xử lý', class: 'bg-yellow-100 text-yellow-800' },
      [ORDER_STATUS.CONFIRMED]: { label: 'Đã xác nhận', class: 'bg-blue-100 text-blue-800' },
      [ORDER_STATUS.SHIPPING]: { label: 'Đang giao', class: 'bg-purple-100 text-purple-800' },
      [ORDER_STATUS.DELIVERED]: { label: 'Đã giao', class: 'bg-green-100 text-green-800' },
      [ORDER_STATUS.CANCELLED]: { label: 'Đã hủy', class: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status] || statusConfig[ORDER_STATUS.PENDING];
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const getStatusOptions = (currentStatus) => {
    const statusOptions = {
      [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.SHIPPING, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.SHIPPING]: [ORDER_STATUS.DELIVERED],
      [ORDER_STATUS.DELIVERED]: [],
      [ORDER_STATUS.CANCELLED]: [],
    };

    return statusOptions[currentStatus] || [];
  };

  const formatPrice = (price) => {
    return price?.toLocaleString() + '₫';
  };

  const columns = [
    { key: 'index', header: 'STT', render: (_, __, index) => index + 1 },
    { key: 'orderNumber', header: 'Mã đơn hàng' },
    { 
      key: 'customer', 
      header: 'Khách hàng', 
      render: (_, order) => order.customer?.name || order.customerName || '-'
    },
    { 
      key: 'totalAmount', 
      header: 'Tổng tiền', 
      render: (totalAmount) => formatPrice(totalAmount)
    },
    { 
      key: 'status', 
      header: 'Trạng thái', 
      render: (status) => getStatusBadge(status)
    },
    {
      key: 'createdAt',
      header: 'Ngày đặt',
      render: (createdAt) => {
        if (!createdAt) return '-';
        return new Date(createdAt).toLocaleDateString('vi-VN');
      }
    },
    {
      key: 'actions',
      header: 'Hành động',
      align: 'center',
      render: (_, order) => {
        const availableStatuses = getStatusOptions(order.status);
        
        return (
          <div className="space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {/* TODO: View order details */}}
            >
              Xem
            </Button>
            {availableStatuses.length > 0 && (
              <select
                className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Cập nhật trạng thái</option>
                {availableStatuses.map(status => (
                  <option key={status} value={status}>
                    {getStatusBadge(status).props.children}
                  </option>
                ))}
              </select>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Quản lý đơn hàng"
        subtitle="Theo dõi và quản lý tất cả đơn hàng trong hệ thống"
      />

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        error={error}
        emptyMessage="Chưa có đơn hàng nào."
      />
    </div>
  );
};

export default Orders; 