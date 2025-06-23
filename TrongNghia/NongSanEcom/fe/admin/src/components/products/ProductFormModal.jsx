import React from 'react';
import { Button, Modal } from '../common';

const ProductFormModal = ({ isOpen, onClose, editingProduct, formData, setFormData, handleFormChange, handleSubmit, CATEGORY_OPTIONS, STATUS_FORM_OPTIONS }) => {
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
            <input type="text" name="unit" value={formData.unit} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:ring-green-500" placeholder="kg, chai, lon..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <select name="category" value={formData.category} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:ring-green-500">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh sản phẩm</label>
          <input type="file" name="images" multiple accept="image/*" onChange={handleImageChange} className="w-full" />
          {/* Hiển thị preview ảnh nếu có */}
          {formData.images && Array.isArray(formData.images) && formData.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.from(formData.images).map((img, idx) => (
                <img
                  key={idx}
                  src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="primary">{editingProduct ? 'Cập nhật' : 'Thêm mới'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal; 