import React from 'react';
import { Button, Modal } from '../common';

const emptyAddress = {
  street: '',
  city: '',
  district: '',
  ward: '',
  postalCode: '',
  country: 'Vietnam',
  isDefault: false,
};

const UserFormModal = ({ isOpen, onClose, editingUser, formData, setFormData, handleFormChange, handleSubmit, STATUS_FORM_OPTIONS, USER_ROLES }) => {
  // Địa chỉ động
  const addresses = formData.addresses || [];

  const handleAddressChange = (idx, e) => {
    const { name, value, type, checked } = e.target;
    const updated = addresses.map((addr, i) =>
      i === idx ? { ...addr, [name]: type === 'checkbox' ? checked : value } : addr
    );
    setFormData({ ...formData, addresses: updated });
  };

  const addAddress = () => {
    setFormData({ ...formData, addresses: [...addresses, { ...emptyAddress, isDefault: addresses.length === 0 }] });
  };

  const removeAddress = (idx) => {
    const updated = addresses.filter((_, i) => i !== idx);
    // Nếu xóa địa chỉ mặc định, gán mặc định cho địa chỉ đầu tiên nếu còn
    if (addresses[idx]?.isDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }
    setFormData({ ...formData, addresses: updated });
  };

  const setDefaultAddress = (idx) => {
    setFormData({
      ...formData,
      addresses: addresses.map((addr, i) => ({ ...addr, isDefault: i === idx })),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 z-10">
        {/* Thông tin cơ bản */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên *</label>
            <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:ring-green-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:ring-green-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:ring-green-500" placeholder="Số điện thoại" />
          </div>
          {
            !editingUser && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
                <input type="password" name="password" value={formData.password} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:ring-green-500" required minLength={8} />
              </div>
            )
          }
        </div>
        {/* Vai trò & trạng thái */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò *</label>
            <select name="role" value={formData.role} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:ring-green-500" required>
              <option value={USER_ROLES.STAFF}>Nhân viên</option>
              <option value={USER_ROLES.ADMIN}>Quản trị viên</option>
              <option value={USER_ROLES.CUSTOMER}>Khách hàng</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái *</label>
            <select name="status" value={formData.status} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:ring-green-500" required>
              {STATUS_FORM_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Địa chỉ */}
        <div className="bg-gray-50 rounded p-4 border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-green-700">Địa chỉ</span>
            <Button type="button" variant="primary" size="sm" onClick={addAddress}>+ Thêm địa chỉ</Button>
          </div>
          {addresses.length === 0 && <div className="text-gray-400 italic">Chưa có địa chỉ nào.</div>}
          <div className="max-h-64 overflow-y-auto pr-1 scrollbar-hide scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {addresses.map((addr, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 bg-white p-3 rounded shadow-sm border relative">
                <div>
                  <label className="block text-xs font-medium mb-1">Đường/phố *</label>
                  <input type="text" name="street" value={addr.street} onChange={e => handleAddressChange(idx, e)} className="w-full px-2 py-1 border rounded" required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Phường/xã *</label>
                  <input type="text" name="ward" value={addr.ward} onChange={e => handleAddressChange(idx, e)} className="w-full px-2 py-1 border rounded" required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Quận/huyện *</label>
                  <input type="text" name="district" value={addr.district} onChange={e => handleAddressChange(idx, e)} className="w-full px-2 py-1 border rounded" required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Thành phố *</label>
                  <input type="text" name="city" value={addr.city} onChange={e => handleAddressChange(idx, e)} className="w-full px-2 py-1 border rounded" required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Mã bưu chính *</label>
                  <input type="text" name="postalCode" value={addr.postalCode} onChange={e => handleAddressChange(idx, e)} className="w-full px-2 py-1 border rounded" required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Quốc gia *</label>
                  <input type="text" name="country" value={addr.country} onChange={e => handleAddressChange(idx, e)} className="w-full px-2 py-1 border rounded" required />
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0 col-span-1 md:col-span-3">
                  <input type="checkbox" name="isDefault" checked={!!addr.isDefault} onChange={() => setDefaultAddress(idx)} className="mr-1" />
                  <span className="text-xs">Địa chỉ mặc định</span>
                  {addresses.length > 1 && (
                    <Button type="button" variant="danger" size="xs" className="ml-4" onClick={() => removeAddress(idx)}>
                      Xóa
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="primary">{editingUser ? 'Cập nhật' : 'Thêm mới'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal; 