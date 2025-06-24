import React from 'react';

const RecentActivities = ({ activities, loading }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatPrice = (price) => {
    return price?.toLocaleString() + '₫';
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'staff':
        return 'Nhân viên';
      case 'customer':
        return 'Khách hàng';
      default:
        return role;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'shipping':
        return 'Đang giao';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'shipping':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
      
      <div className="space-y-6">
        {/* Người dùng mới */}
        {activities.users && activities.users.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Người dùng mới</h4>
            <div className="space-y-3">
              {activities.users.map((user, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">
                      {user.email} • {getRoleLabel(user.role)} • {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sản phẩm mới */}
        {activities.products && activities.products.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Sản phẩm mới</h4>
            <div className="space-y-3">
              {activities.products.map((product, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                    📦
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatPrice(product.price)} • {product.category?.name} • {formatDate(product.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Đơn hàng mới */}
        {activities.orders && activities.orders.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Đơn hàng mới</h4>
            <div className="space-y-3">
              {activities.orders.map((order, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs">
                    🛒
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      #{order.orderNumber} - {order.user?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatPrice(order.totalPrice)} • 
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                      • {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!activities.users || activities.users.length === 0) &&
         (!activities.products || activities.products.length === 0) &&
         (!activities.orders || activities.orders.length === 0) && (
          <div className="text-center py-8">
            <p className="text-gray-500 italic">Chưa có hoạt động nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivities; 