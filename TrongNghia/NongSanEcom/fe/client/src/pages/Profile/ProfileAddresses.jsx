import React from 'react';

const ProfileAddresses = ({
  addresses,
  newAddress,
  onAdd,
  onChangeNew,
  onDelete,
  onSetDefault,
  loading,
  error,
  success,
  setNewAddress,
  emptyAddress
}) => {
  const defaultAddress = Array.isArray(addresses) ? addresses.find(a => a.isDefault) : undefined;
  const defaultAddressId = defaultAddress ? defaultAddress.id || defaultAddress._id : undefined;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mt-8">
      <h2 className="text-xl font-bold text-green-700 mb-4">Địa chỉ giao hàng</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <div className="grid gap-4 mb-4">
        {!addresses || addresses.length === 0 && <div className="text-gray-500">Chưa có địa chỉ nào.</div>}
        {addresses && addresses.map(addr => (
          <div key={addr._id || addr.id} className={`flex flex-col md:flex-row md:items-center justify-between p-3 rounded border ${addr.isDefault ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex-1">
              <div className="font-medium text-gray-800">
                {addr.street}, {addr.ward}, {addr.district}, {addr.city}, {addr.country} {addr.postalCode && `- ${addr.postalCode}`}
              </div>
              {addr.isDefault && <span className="inline-block text-xs bg-green-600 text-white px-2 py-0.5 rounded ml-2">Mặc định</span>}
            </div>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              {!addr.isDefault && (
                <button onClick={() => onSetDefault(addr._id || addr.id)} className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Đặt làm mặc định</button>
              )}
              {!addr.isDefault && (
                <button onClick={() => onDelete(addr._id || addr.id)} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200">Xóa</button>
              )}
            </div>
          </div>
        ))}
      </div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-2" onSubmit={onAdd}>
        <input className="border rounded px-3 py-2" placeholder="Số nhà, đường..." value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} disabled={loading} />
        <input className="border rounded px-3 py-2" placeholder="Phường/Xã" value={newAddress.ward} onChange={e => setNewAddress({ ...newAddress, ward: e.target.value })} disabled={loading} />
        <input className="border rounded px-3 py-2" placeholder="Quận/Huyện" value={newAddress.district} onChange={e => setNewAddress({ ...newAddress, district: e.target.value })} disabled={loading} />
        <input className="border rounded px-3 py-2" placeholder="Tỉnh/Thành phố" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} disabled={loading} />
        <input className="border rounded px-3 py-2" placeholder="Mã bưu điện" value={newAddress.postalCode} onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })} disabled={loading} />
        <input className="border rounded px-3 py-2" placeholder="Quốc gia" value={newAddress.country} onChange={e => setNewAddress({ ...newAddress, country: e.target.value })} disabled={loading} />
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow col-span-1 md:col-span-2" disabled={loading}>Thêm</button>
      </form>
    </div>
  );
};

export default ProfileAddresses; 