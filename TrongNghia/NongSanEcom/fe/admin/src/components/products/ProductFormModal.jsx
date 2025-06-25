import React from 'react';
import { Button, Modal } from '../common';

const ProductFormModal = ({ isOpen, onClose, editingProduct, formData, setFormData, handleFormChange, handleSubmit, CATEGORY_OPTIONS, UNIT_OPTIONS, STATUS_FORM_OPTIONS, submitLoading = false }) => {
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const handleRemoveImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`File ${file.name} không phải là hình ảnh`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(`File ${file.name} quá lớn (tối đa 5MB)`);
        return false;
      }
      return true;
    });

    const currentImages = Array.isArray(formData.images) ? formData.images : [];
    const totalImages = currentImages.length + validFiles.length;
    
    if (totalImages > 10) {
      alert('Tối đa 10 hình ảnh cho mỗi sản phẩm');
      return;
    }

    setFormData({ ...formData, images: [...currentImages, ...validFiles] });
  };

  const getImageUrl = (image) => {
    if (typeof image === 'string') {
      return image; // URL từ server
    }
    if (image instanceof File) {
      return URL.createObjectURL(image); // File mới được chọn
    }
    return '';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
            <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:ring-green-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ) *</label>
            <input type="number" name="price" min="0" value={formData.price} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:ring-green-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho *</label>
            <input type="number" name="countInStock" min="0" value={formData.countInStock} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:ring-green-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị *</label>
            <select name="unit" value={formData.unit} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:ring-green-500" required>
              <option value="">Chọn đơn vị</option>
              {UNIT_OPTIONS?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục *</label>
            <select name="category" value={formData.category} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:ring-green-500" required>
              <option value="">Chọn danh mục</option>
              {CATEGORY_OPTIONS?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Xuất xứ</label>
            <input type="text" name="origin" value={formData.origin} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giảm giá (%)</label>
            <input type="number" name="discount" min="0" max="100" value={formData.discount} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select name="status" value={formData.status} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:ring-green-500">
              {STATUS_FORM_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea name="description" value={formData.description} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:ring-green-500" rows={3} />
        </div>
        
        {/* Quản lý hình ảnh */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hình ảnh sản phẩm 
            <span className="text-xs text-gray-500 ml-2">
              ({formData.images?.length || 0}/10)
            </span>
          </label>
          
          {/* Thêm hình ảnh mới */}
          <div className="mb-4">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleAddImages} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Chọn nhiều hình ảnh để thêm vào sản phẩm (tối đa 10 hình, mỗi hình tối đa 5MB)
            </p>
          </div>

          {/* Hiển thị preview hình ảnh */}
          {formData.images && Array.isArray(formData.images) && formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={getImageUrl(img)}
                    alt={`preview-${idx}`}
                    className="w-full h-32 object-cover rounded-lg border"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCI+SW1hZ2U8L3RleHQ+PC9zdmc+';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="Xóa hình ảnh"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-1 left-1 bg-black opacity-50 text-white text-xs px-2 py-1 rounded">
                    {typeof img === 'string' ? 'Đã lưu' : 'Mới'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitLoading}>
            Hủy
          </Button>
          <Button type="submit" variant="primary" disabled={submitLoading}>
            {submitLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{editingProduct ? 'Đang cập nhật...' : 'Đang thêm...'}</span>
              </div>
            ) : (
              editingProduct ? 'Cập nhật' : 'Thêm mới'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal; 