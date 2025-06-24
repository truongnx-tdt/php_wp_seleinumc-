import React from 'react';
import { Modal } from '../common';

const ProductDetailModal = ({ isOpen, onClose, product }) => {
  if (!product) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatPrice = (price) => {
    return price?.toLocaleString() + '₫';
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-lg ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết sản phẩm" size="2xl">
      <div className="space-y-6">
        {/* Thông tin cơ bản */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                <p className="text-sm text-gray-900">{product.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Giá</label>
                <p className="text-sm text-gray-900">{formatPrice(product.price)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tồn kho</label>
                <p className="text-sm text-gray-900">{product.countInStock}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                <p className="text-sm text-gray-900">{product.category?.name || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Đơn vị</label>
                <p className="text-sm text-gray-900">
                  {product.unit ? `${product.unit.name} (${product.unit.symbol})` : '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Xuất xứ</label>
                <p className="text-sm text-gray-900">{product.origin}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Giảm giá</label>
                <p className="text-sm text-gray-900">{product.discount || 0}%</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sản phẩm hữu cơ</label>
                <p className="text-sm text-gray-900">{product.isOrganic ? 'Có' : 'Không'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin hệ thống</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Người tạo</label>
                <p className="text-sm text-gray-900">{product.createdBy?.name || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Người cập nhật</label>
                <p className="text-sm text-gray-900">{product.updatedBy?.name || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngày tạo</label>
                <p className="text-sm text-gray-900">{formatDate(product.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngày cập nhật</label>
                <p className="text-sm text-gray-900">{formatDate(product.updatedAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Đánh giá trung bình</label>
                <div className="flex items-center space-x-2">
                  <div className="flex">{renderStars(product.rating)}</div>
                  <span className="text-sm text-gray-900">({product.rating.toFixed(1)})</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số đánh giá</label>
                <p className="text-sm text-gray-900">{product.numReviews}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mô tả */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mô tả</h3>
          <p className="text-sm text-gray-900 whitespace-pre-wrap">{product.description}</p>
        </div>

        {/* Hình ảnh */}
        {product.images && product.images.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hình ảnh sản phẩm</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <div key={index} className="aspect-square">
                  <img
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Đánh giá */}
        {product.reviews && product.reviews.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Đánh giá ({product.reviews.length})</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {product.reviews.map((review, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{review.name}</span>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-900">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nút đóng */}
        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailModal; 