import React from 'react';
import { Button } from '../components/common';
import { ORDER_STATUS } from '../constants';

const OrderFilterBar = React.memo(function OrderFilterBar({ filters, setFilters, setPagination, resetFilters }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6 items-end bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">Tìm kiếm</label>
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input
            type="text"
            placeholder="Mã đơn, tên, email..."
            value={filters.search}
            onChange={e => { setFilters(f => ({ ...f, search: e.target.value })); setPagination(p => ({ ...p, page: 1 })); }}
            className="pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 w-48 transition"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">Trạng thái</label>
        <select
          value={filters.status}
          onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPagination(p => ({ ...p, page: 1 })); }}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[120px] transition"
        >
          <option value="">Tất cả</option>
          {Object.entries(ORDER_STATUS).map(([key, value]) => (
            <option key={key} value={value}>{value}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">Phương thức</label>
        <select
          value={filters.paymentMethod}
          onChange={e => { setFilters(f => ({ ...f, paymentMethod: e.target.value })); setPagination(p => ({ ...p, page: 1 })); }}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[120px] transition"
        >
          <option value="">Tất cả</option>
          <option value="COD">COD</option>
          <option value="VNPAY">VNPAY</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">Từ ngày</label>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={e => { setFilters(f => ({ ...f, dateFrom: e.target.value })); setPagination(p => ({ ...p, page: 1 })); }}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[120px] transition"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">Đến ngày</label>
        <input
          type="date"
          value={filters.dateTo}
          onChange={e => { setFilters(f => ({ ...f, dateTo: e.target.value })); setPagination(p => ({ ...p, page: 1 })); }}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[120px] transition"
        />
      </div>
      <div className="flex flex-col justify-end">
        <Button variant="danger" onClick={() => { resetFilters(); setPagination(p => ({ ...p, page: 1 })); }} className="h-10 px-4 text-sm font-semibold">Xóa bộ lọc</Button>
      </div>
    </div>
  );
});

export default OrderFilterBar; 