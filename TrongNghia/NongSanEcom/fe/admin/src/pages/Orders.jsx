import React from 'react';

const orders = [
  { id: 'DH001', customer: 'Nguyễn Văn A', total: 1200000, status: 'Đã giao', date: '2024-06-01' },
  { id: 'DH002', customer: 'Trần Thị B', total: 800000, status: 'Đang xử lý', date: '2024-06-02' },
];

const Orders = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Quản trị đơn hàng</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow text-sm sm:text-base">
        <thead>
          <tr>
            <th className="py-2 px-2 sm:px-4 border-b">Mã đơn</th>
            <th className="py-2 px-2 sm:px-4 border-b">Khách hàng</th>
            <th className="py-2 px-2 sm:px-4 border-b">Tổng tiền</th>
            <th className="py-2 px-2 sm:px-4 border-b">Trạng thái</th>
            <th className="py-2 px-2 sm:px-4 border-b">Ngày tạo</th>
            <th className="py-2 px-2 sm:px-4 border-b">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="py-2 px-2 sm:px-4 border-b">{o.id}</td>
              <td className="py-2 px-2 sm:px-4 border-b">{o.customer}</td>
              <td className="py-2 px-2 sm:px-4 border-b">{o.total.toLocaleString()}₫</td>
              <td className="py-2 px-2 sm:px-4 border-b">{o.status}</td>
              <td className="py-2 px-2 sm:px-4 border-b">{o.date}</td>
              <td className="py-2 px-2 sm:px-4 border-b">
                <button className="bg-green-600 text-white px-2 py-1 rounded">Xem</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Orders; 