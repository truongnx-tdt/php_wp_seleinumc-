import React from 'react';
import { Button } from '../common';

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'active', label: 'Hiển thị' },
  { value: 'inactive', label: 'Ẩn' },
];
const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Ngày tạo' },
  { value: 'name', label: 'Tên' },
  { value: 'price', label: 'Giá' },
];
const ORDER_OPTIONS = [
  { value: 'desc', label: 'Giảm dần' },
  { value: 'asc', label: 'Tăng dần' },
];

const ProductFilterBar = ({ filter, setFilter, CATEGORY_OPTIONS, disabled = false }) => {
  const handleChange = (e) => {
    if (disabled) return;
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };
  const handleReset = () => {
    if (disabled) return;
    setFilter({
      search: '',
      category: '',
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
          placeholder="Tên sản phẩm..."
          value={filter.search}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Danh mục</label>
        <select
          name="category"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={filter.category}
          onChange={handleChange}
          disabled={disabled}
        >
          <option value="">Tất cả</option>
          {CATEGORY_OPTIONS?.map(opt => (
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
          disabled={disabled}
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
          disabled={disabled}
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
          disabled={disabled}
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Sắp xếp</label>
        <select
          name="sort"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={filter.sort}
          onChange={handleChange}
          disabled={disabled}
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
          disabled={disabled}
        >
          {ORDER_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 mt-2 md:mt-0">
        <Button type="button" variant="outline" size="sm" onClick={handleReset} disabled={disabled}>Reset</Button>
      </div>
    </form>
  );
};

export default ProductFilterBar; 