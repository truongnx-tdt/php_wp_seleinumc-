import React from 'react';
import { Button } from '../common';

const ROLE_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Nhân viên' },
  { value: 'customer', label: 'Khách hàng' },
];
const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Ngừng hoạt động' },
  { value: 'banned', label: 'Bị khóa' },
];
const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Ngày tạo' },
  { value: 'name', label: 'Tên' },
  { value: 'email', label: 'Email' },
];
const ORDER_OPTIONS = [
  { value: 'desc', label: 'Giảm dần' },
  { value: 'asc', label: 'Tăng dần' },
];

const UserFilterBar = ({ filter, setFilter }) => {
  const handleChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };
  const handleReset = () => {
    setFilter({
      search: '',
      role: '',
      status: '',
      sort: 'createdAt',
      order: 'desc',
      createdAtFrom: '',
      createdAtTo: '',
    });
  };
  return (
    <form className="flex flex-col md:flex-row md:items-end gap-3 bg-white p-4 rounded shadow mb-4" onSubmit={e => e.preventDefault()}>
      <div className="flex-1">
        <label className="block text-xs font-medium mb-1">Tìm kiếm</label>
        <input
          type="text"
          name="search"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Tên, email..."
          value={filter.search}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Vai trò</label>
        <select
          name="role"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={filter.role}
          onChange={handleChange}
        >
          {ROLE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Trạng thái</label>
        <select
          name="status"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={filter.status}
          onChange={handleChange}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Từ ngày</label>
        <input
          type="date"
          name="createdAtFrom"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={filter.createdAtFrom || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Đến ngày</label>
        <input
          type="date"
          name="createdAtTo"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={filter.createdAtTo || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Sắp xếp</label>
        <select
          name="sort"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={filter.sort}
          onChange={handleChange}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Thứ tự</label>
        <select
          name="order"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={filter.order}
          onChange={handleChange}
        >
          {ORDER_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 mt-2 md:mt-0">
        <Button type="button" variant="outline" size="sm" onClick={handleReset}>Reset</Button>
      </div>
    </form>
  );
};

export default UserFilterBar; 