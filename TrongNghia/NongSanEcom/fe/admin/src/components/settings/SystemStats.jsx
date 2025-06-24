import React from 'react';
import { LoadingSpinner } from '../common';

const SystemStats = ({ statistics, loading }) => {
  if (loading) {
    return <LoadingSpinner text="Đang tải thống kê..." />;
  }

  const stats = [
    {
      title: 'Tổng người dùng',
      value: statistics.totalUsers || 0,
      icon: '👥',
      color: 'bg-blue-500',
    },
    {
      title: 'Tổng sản phẩm',
      value: statistics.totalProducts || 0,
      icon: '📦',
      color: 'bg-green-500',
    },
    {
      title: 'Tổng đơn hàng',
      value: statistics.totalOrders || 0,
      icon: '🛒',
      color: 'bg-yellow-500',
    },
    {
      title: 'Danh mục',
      value: statistics.totalCategories || 0,
      icon: '📂',
      color: 'bg-purple-500',
    },
    {
      title: 'Đơn vị',
      value: statistics.totalUnits || 0,
      icon: '📏',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-full text-white text-xl`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SystemStats; 