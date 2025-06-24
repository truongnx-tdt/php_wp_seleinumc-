import React, { useState, useEffect } from 'react';
import { FormInput } from '../common';

const CategoryFilterBar = ({ filter, setFilter }) => {
  const [searchValue, setSearchValue] = useState(filter.search || '');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilter(prev => ({
        ...prev,
        search: searchValue
      }));
    }, 400);

    return () => clearTimeout(handler);
  }, [searchValue, setFilter]);

  const handleFilterChange = (field, value) => {
    if (field === 'search') {
      setSearchValue(value);
    } else {
      setFilter(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleClearFilter = () => {
    setFilter({});
    setSearchValue('');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          label="Tìm kiếm theo tên"
          type="text"
          placeholder="Nhập tên danh mục..."
          value={searchValue}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filter.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Ẩn</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleClearFilter}
            className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilterBar; 