import React, { useEffect, useState } from 'react';

const COLORS = [
  'fill-green-600',
  'fill-yellow-500',
  'fill-blue-500',
];

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const user = JSON.parse(localStorage.getItem('adminUser'));
        const res = await fetch('http://localhost:5000/api/products/dashboard-stats', {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        if (!res.ok) throw new Error('Không lấy được dữ liệu');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const total = stats.users + stats.products + stats.orders;
  const pieData = [
    { label: 'Người dùng', value: stats.users },
    { label: 'Sản phẩm', value: stats.products },
    { label: 'Đơn hàng', value: stats.orders },
  ];

  // Tính góc cho pie chart
  let acc = 0;
  const pieSlices = pieData.map((d, i) => {
    const angle = total ? (d.value / total) * 360 : 0;
    const large = angle > 180 ? 1 : 0;
    const r = 40, cx = 50, cy = 50;
    const x1 = cx + r * Math.cos((Math.PI * acc) / 180);
    const y1 = cy + r * Math.sin((Math.PI * acc) / 180);
    acc += angle;
    const x2 = cx + r * Math.cos((Math.PI * acc) / 180);
    const y2 = cy + r * Math.sin((Math.PI * acc) / 180);
    const dPath = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`;
    return <path key={d.label} d={dPath} className={COLORS[i]} />;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Chào mừng đến trang quản trị!</h1>
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 100 100" className="mb-4">
              {pieSlices}
            </svg>
            <div className="flex gap-4 justify-center">
              {pieData.map((d, i) => (
                <div key={d.label} className="flex items-center gap-1">
                  <span className={`inline-block w-3 h-3 rounded-full ${COLORS[i]}`}></span>
                  <span className="text-sm">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {pieData.map((d, i) => (
              <div key={d.label} className="bg-white rounded shadow p-4 flex items-center gap-4">
                <span className={`inline-block w-4 h-4 rounded-full ${COLORS[i]}`}></span>
                <span className="font-medium">{d.label}</span>
                <span className="ml-auto text-xl font-bold text-green-700">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 