import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { PageHeader, LoadingSpinner } from '../components/common';
import { API_ENDPOINTS } from '../constants';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useAuth();
  const { get } = useApi();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalUnits: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [revenueByMonth, setRevenueByMonth] = useState(Array(12).fill(0));
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [revenueByDay, setRevenueByDay] = useState([]);
  const [revenueDayLoading, setRevenueDayLoading] = useState(false);

  // Tạo danh sách năm từ 2022 đến năm hiện tại (hook phải ở ngoài if)
  const yearOptions = useMemo(() => {
    const now = new Date().getFullYear();
    const arr = [];
    for (let y = now; y >= 2022; y--) arr.push(y);
    return arr;
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load system settings for stats
        const settingsData = await get(API_ENDPOINTS.USERS.SETTINGS);
        if (settingsData.statistics) {
          setStats({
            totalOrders: settingsData.statistics.totalOrders || 0,
            totalProducts: settingsData.statistics.totalProducts || 0,
            totalCategories: settingsData.statistics.totalCategories || 0,
            totalUnits: settingsData.statistics.totalUnits || 0,
          });
        }

        // Load recent orders
        const ordersData = await get(API_ENDPOINTS.ORDERS.LIST + '?limit=5');
        if (ordersData.orders) {
          setRecentOrders(ordersData.orders);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [get]);

  useEffect(() => {
    if (user?.role === 'admin') {
      setAdminLoading(true);
      get('/api/orders/dashboard/admin-stats')
        .then((data) => setAdminStats(data))
        .catch(() => setAdminStats(null))
        .finally(() => setAdminLoading(false));
    }
  }, [user, get]);

  useEffect(() => {
    if (user?.role === 'admin') {
      setRevenueLoading(true);
      get(`/api/orders/dashboard/revenue-by-year?year=${selectedYear}`)
        .then((data) => setRevenueByMonth(data.revenueByMonth))
        .catch(() => setRevenueByMonth(Array(12).fill(0)))
        .finally(() => setRevenueLoading(false));
    }
  }, [user, get, selectedYear]);

  useEffect(() => {
    if (user?.role === 'admin') {
      setRevenueDayLoading(true);
      get(`/api/orders/dashboard/revenue-by-day-in-month?year=${selectedYear}&month=${selectedMonth}`)
        .then((data) => setRevenueByDay(data.revenueByDay))
        .catch(() => setRevenueByDay([]))
        .finally(() => setRevenueDayLoading(false));
    }
  }, [user, get, selectedYear, selectedMonth]);

  if (loading) {
    return <LoadingSpinner text="Đang tải dữ liệu dashboard..." />;
  }

  if (user?.role === 'admin') {
    if (adminLoading) return <LoadingSpinner text="Đang tải dữ liệu dashboard..." />;
    return (
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Dashboard" subtitle={`Chào mừng ${user?.name}! Tổng quan quản trị`} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600 mb-1">Tổng doanh thu</div>
            <div className="text-2xl font-bold text-green-600">{adminStats?.totalRevenue?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600 mb-1">Doanh thu hôm nay</div>
            <div className="text-2xl font-bold text-blue-600">{adminStats?.todayRevenue?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600 mb-1">Đơn hàng hôm nay</div>
            <div className="text-2xl font-bold text-orange-600">{adminStats?.todayOrders}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600 mb-1">Đơn hàng trong tháng</div>
            <div className="text-2xl font-bold text-purple-600">{adminStats?.monthOrders}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Doanh thu theo tháng</h3>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
            >
              {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {revenueLoading ? <LoadingSpinner text="Đang tải biểu đồ doanh thu..." /> : (
            <Bar
              data={{
                labels: [
                  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
                ],
                datasets: [
                  {
                    label: `Doanh thu năm ${selectedYear}`,
                    data: revenueByMonth,
                    backgroundColor: 'rgba(59,130,246,0.7)',
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: false },
                },
              }}
              height={320}
            />
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Doanh thu theo ngày trong tháng</h3>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
              ))}
            </select>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
            >
              {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {revenueDayLoading ? <LoadingSpinner text="Đang tải biểu đồ doanh thu..." /> : (
            <Bar
              data={{
                labels: revenueByDay.map((_, i) => `Ngày ${i + 1}`),
                datasets: [
                  {
                    label: `Doanh thu tháng ${selectedMonth}/${selectedYear}`,
                    data: revenueByDay,
                    backgroundColor: 'rgba(34,197,94,0.7)',
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: false },
                },
              }}
              height={320}
            />
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top sản phẩm bán chạy</h3>
          {adminStats?.topProducts?.length > 0 ? (
            <Bar
              data={{
                labels: adminStats.topProducts.map(p => p.name),
                datasets: [
                  {
                    label: 'Số lượng bán',
                    data: adminStats.topProducts.map(p => p.totalSold),
                    backgroundColor: 'rgba(34,197,94,0.7)',
                  },
                  {
                    label: 'Doanh thu',
                    data: adminStats.topProducts.map(p => p.totalRevenue),
                    backgroundColor: 'rgba(59,130,246,0.5)',
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: false },
                },
              }}
              height={300}
            />
          ) : (
            <div className="text-gray-500">Chưa có dữ liệu sản phẩm bán chạy.</div>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin hệ thống</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Vai trò hiện tại:</span>
              <span className="font-medium">Quản trị viên</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ngày tham gia:</span>
              <span className="font-medium">{user?.createdAt ? formatDate(user.createdAt) : '-'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipping':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Dashboard"
        subtitle={`Chào mừng ${user?.name}! Tổng quan hệ thống quản lý nông sản`}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Thống kê tổng quan */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sản phẩm</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-purple-100">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Danh mục</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCategories.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-orange-100">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đơn vị</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUnits.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ và thống kê chi tiết */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng gần đây</h3>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Đơn hàng #{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">
                      {order.user?.name || 'Khách hàng'} - {order.orderItems?.length || 0} sản phẩm
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Chưa có đơn hàng nào</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin hệ thống</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Vai trò hiện tại:</span>
              <span className="font-medium">
                {user?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ngày tham gia:</span>
              <span className="font-medium">
                {user?.createdAt ? formatDate(user.createdAt) : '-'}
              </span>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {user?.role === 'admin' 
                  ? 'Bạn có quyền truy cập tất cả chức năng của hệ thống.'
                  : 'Bạn có quyền quản lý đơn hàng, sản phẩm, danh mục và đơn vị.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 