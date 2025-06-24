import React from 'react';
import { Modal, FormInput, Button } from '../common';

const UnitFormModal = ({
  isOpen,
  onClose,
  editingUnit,
  formData,
  setFormData,
  handleFormChange,
  handleSubmit
}) => {
  const isEditing = !!editingUnit;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Sửa đơn vị' : 'Thêm đơn vị mới'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Tên đơn vị *"
          type="text"
          placeholder="Nhập tên đơn vị..."
          value={formData.name || ''}
          onChange={(e) => handleFormChange('name', e.target.value)}
          required
        />

        <FormInput
          label="Ký hiệu *"
          type="text"
          placeholder="Nhập ký hiệu đơn vị..."
          value={formData.symbol || ''}
          onChange={(e) => handleFormChange('symbol', e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            placeholder="Nhập mô tả đơn vị..."
            value={formData.description || ''}
            onChange={(e) => handleFormChange('description', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.isActive !== undefined ? formData.isActive : true}
            onChange={(e) => handleFormChange('isActive', e.target.value === 'true')}
          >
            <option value={true}>Hoạt động</option>
            <option value={false}>Ẩn</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            {isEditing ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UnitFormModal; 