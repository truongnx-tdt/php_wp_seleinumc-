import React from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { BANNER_POSITIONS, BANNER_STATUS_OPTIONS } from '../../constants';

const BannerFilterBar = ({ filter, setFilter, onAdd }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilter({
      search: '',
      position: '',
      isActive: '',
      startDate: '',
      endDate: '',
      sort: 'priority',
      order: 'desc',
    });
  };

  const hasActiveFilters = filter.search || filter.position || filter.isActive || filter.startDate || filter.endDate;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="search"
              value={filter.search}
              onChange={handleFilterChange}
              placeholder="Tìm kiếm banner..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Position Filter */}
        <div className="w-full lg:w-48">
          <select
            name="position"
            value={filter.position}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tất cả vị trí</option>
            {BANNER_POSITIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full lg:w-40">
          <select
            name="isActive"
            value={filter.isActive}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tất cả trạng thái</option>
            {BANNER_STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="flex gap-2">
          <input
            type="date"
            name="startDate"
            value={filter.startDate}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Từ ngày"
          />
          <input
            type="date"
            name="endDate"
            value={filter.endDate}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Đến ngày"
          />
        </div>

        {/* Sort */}
        <div className="flex gap-2">
          <select
            name="sort"
            value={filter.sort}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="priority">Độ ưu tiên</option>
            <option value="createdAt">Ngày tạo</option>
            <option value="title">Tiêu đề</option>
          </select>
          <select
            name="order"
            value={filter.order}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="desc">Giảm dần</option>
            <option value="asc">Tăng dần</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FiX />
              Xóa bộ lọc
            </button>
          )}
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FiFilter />
            Thêm Banner
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filter.search && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                Tìm kiếm: {filter.search}
              </span>
            )}
            {filter.position && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                Vị trí: {BANNER_POSITIONS.find(p => p.value === filter.position)?.label}
              </span>
            )}
            {filter.isActive !== '' && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm">
                Trạng thái: {BANNER_STATUS_OPTIONS.find(s => s.value === filter.isActive)?.label}
              </span>
            )}
            {filter.startDate && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm">
                Từ: {new Date(filter.startDate).toLocaleDateString('vi-VN')}
              </span>
            )}
            {filter.endDate && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm">
                Đến: {new Date(filter.endDate).toLocaleDateString('vi-VN')}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerFilterBar; 