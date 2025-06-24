import React from 'react';
import { FiEdit, FiTrash2, FiEye, FiEyeOff, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import useBannerFilters from '../hooks/useBannerFilters';
import BannerFilterBar from '../components/banners/BannerFilterBar';
import BannerFormModal from '../components/banners/BannerFormModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';

const Banners = () => {
  const {
    banners,
    pagination,
    loading,
    filter,
    setFilter,
    setPage,
    openAddModal,
    openEditModal,
    closeModal,
    showModal,
    editingBanner,
    handleSubmit,
    handleDelete,
    handleToggleStatus,
    handleUpdatePriority,
    formData,
    handleFormChange,
    CATEGORY_OPTIONS,
    PRODUCT_OPTIONS,
    BANNER_POSITIONS,
    BANNER_STATUS_OPTIONS,
    submitLoading,
    deleteLoading
  } = useBannerFilters();

  const getPositionLabel = (position) => {
    return BANNER_POSITIONS.find(p => p.value === position)?.label || position;
  };

  const getStatusLabel = (isActive) => {
    return BANNER_STATUS_OPTIONS.find(s => s.value === isActive)?.label || 'Không xác định';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Không giới hạn';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Banner</h1>
        <p className="text-gray-600 mt-2">
          Quản lý các banner hiển thị trên website
        </p>
      </div>

      {/* Filter Bar */}
      <BannerFilterBar
        filter={filter}
        setFilter={setFilter}
        onAdd={openAddModal}
      />

      {/* Banners Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hình ảnh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vị trí
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Độ ưu tiên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {banners.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-4">📢</div>
                      <p className="text-lg font-medium mb-2">Chưa có banner nào</p>
                      <p className="text-sm">Bắt đầu tạo banner đầu tiên để hiển thị trên website</p>
                    </div>
                  </td>
                </tr>
              ) : (
                banners.map((banner) => (
                  <tr key={banner._id} className="hover:bg-gray-50">
                    {/* Image */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-16 w-24">
                        <img
                          className="h-16 w-24 object-cover rounded-lg"
                          src={banner.image}
                          alt={banner.title}
                        />
                      </div>
                    </td>

                    {/* Information */}
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 mb-1">
                          {banner.title}
                        </div>
                        {banner.subtitle && (
                          <div className="text-gray-600 text-xs mb-1">
                            {banner.subtitle}
                          </div>
                        )}
                        {banner.link && (
                          <div className="text-blue-600 text-xs">
                            <a href={banner.link} target="_blank" rel="noopener noreferrer">
                              {banner.linkText || banner.link}
                            </a>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Position */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getPositionLabel(banner.position)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(banner._id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          banner.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        } transition-colors`}
                      >
                        {banner.isActive ? <FiEye className="mr-1" /> : <FiEyeOff className="mr-1" />}
                        {getStatusLabel(banner.isActive)}
                      </button>
                    </td>

                    {/* Priority */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdatePriority(banner._id, banner.priority - 1)}
                          className="text-gray-400 hover:text-gray-600"
                          disabled={banner.priority <= 0}
                        >
                          <FiArrowUp size={16} />
                        </button>
                        <span className="text-sm font-medium text-gray-900">
                          {banner.priority}
                        </span>
                        <button
                          onClick={() => handleUpdatePriority(banner._id, banner.priority + 1)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FiArrowDown size={16} />
                        </button>
                      </div>
                    </td>

                    {/* Date Range */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>Từ: {formatDate(banner.startDate)}</div>
                        <div>Đến: {formatDate(banner.endDate)}</div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(banner)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(banner._id)}
                          disabled={deleteLoading[banner._id]}
                          className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {banners.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Form Modal */}
      <BannerFormModal
        isOpen={showModal}
        onClose={closeModal}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleFormChange}
        editingBanner={editingBanner}
        CATEGORY_OPTIONS={CATEGORY_OPTIONS}
        PRODUCT_OPTIONS={PRODUCT_OPTIONS}
        submitLoading={submitLoading}
      />
    </div>
  );
};

export default Banners; 