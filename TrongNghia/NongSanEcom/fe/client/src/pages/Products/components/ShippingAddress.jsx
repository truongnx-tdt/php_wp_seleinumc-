import React from 'react';
import { FaMapMarkerAlt, FaStar, FaSave } from 'react-icons/fa';

const ShippingAddress = ({
  user,
  selectedAddressId,
  useCustomAddress,
  customAddress,
  saveNewAddress,
  onAddressSelection,
  onCustomAddressToggle,
  onCustomAddressChange,
  onSaveNewAddressChange,
  showError = false
}) => {
  const handleCustomAddressChange = (field, value) => {
    onCustomAddressChange({ ...customAddress, [field]: value });
  };

  // Kiểm tra xem user đã chọn địa chỉ chưa
  const hasSelectedAddress = selectedAddressId && !useCustomAddress;
  const hasValidCustomAddress = useCustomAddress && 
    customAddress.street && customAddress.street.trim() !== '' &&
    customAddress.city && customAddress.city.trim() !== '' &&
    customAddress.district && customAddress.district.trim() !== '' &&
    customAddress.ward && customAddress.ward.trim() !== '' &&
    customAddress.postalCode && customAddress.postalCode.trim() !== '';

  const showAddressError = showError && !hasSelectedAddress && !hasValidCustomAddress;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaMapMarkerAlt className="text-green-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Địa chỉ giao hàng</h2>
        </div>
      </div>

      {/* Existing Addresses */}
      {user.addresses && user.addresses.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Chọn địa chỉ có sẵn
          </label>
          <div className="space-y-3">
            {user.addresses.map((address) => (
              <AddressOption
                key={address._id}
                address={address}
                isSelected={selectedAddressId === address._id && !useCustomAddress}
                onSelect={() => onAddressSelection(address._id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Custom Address Option */}
      <div className="mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={useCustomAddress}
            onChange={(e) => onCustomAddressToggle(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">
            Sử dụng địa chỉ khác
          </span>
        </label>
      </div>

      {/* Custom Address Form */}
      {useCustomAddress && (
        <CustomAddressForm
          customAddress={customAddress}
          saveNewAddress={saveNewAddress}
          onAddressChange={handleCustomAddressChange}
          onSaveNewAddressChange={onSaveNewAddressChange}
        />
      )}

      {/* Error message */}
      {showAddressError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            Vui lòng chọn địa chỉ có sẵn hoặc điền địa chỉ giao hàng mới
          </p>
        </div>
      )}
    </div>
  );
};

const AddressOption = ({ address, isSelected, onSelect }) => (
  <label className="relative">
    <input
      type="radio"
      name="address"
      value={address._id}
      checked={isSelected}
      onChange={onSelect}
      className="sr-only"
    />
    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
      isSelected
        ? 'border-green-500 bg-green-50'
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className="font-medium text-gray-900">
              {address.street}, {address.ward}, {address.district}, {address.city}
            </div>
            {address.isDefault && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <FaStar className="w-3 h-3 mr-1" />
                Mặc định
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {address.postalCode} - {address.country}
          </div>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-3 ${
          isSelected
            ? 'border-green-500 bg-green-500'
            : 'border-gray-300'
        }`}>
          {isSelected && (
            <div className="w-2 h-2 bg-white rounded-full"></div>
          )}
        </div>
      </div>
    </div>
  </label>
);

const CustomAddressForm = ({ customAddress, saveNewAddress, onAddressChange, onSaveNewAddressChange }) => {
  const requiredFields = ['street', 'city', 'district', 'ward', 'postalCode'];
  
  const isFieldValid = (fieldName) => {
    return customAddress[fieldName] && customAddress[fieldName].trim() !== '';
  };
  
  const getFieldError = (fieldName) => {
    return !isFieldValid(fieldName) ? 'Trường này là bắt buộc' : '';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AddressInput
          label="Đường/Phố *"
          value={customAddress.street}
          onChange={(value) => onAddressChange('street', value)}
          placeholder="Nhập tên đường/phố"
          error={getFieldError('street')}
          required
        />
        <AddressInput
          label="Phường/Xã *"
          value={customAddress.ward}
          onChange={(value) => onAddressChange('ward', value)}
          placeholder="Nhập phường/xã"
          error={getFieldError('ward')}
          required
        />
        <AddressInput
          label="Quận/Huyện *"
          value={customAddress.district}
          onChange={(value) => onAddressChange('district', value)}
          placeholder="Nhập quận/huyện"
          error={getFieldError('district')}
          required
        />
        <AddressInput
          label="Tỉnh/Thành phố *"
          value={customAddress.city}
          onChange={(value) => onAddressChange('city', value)}
          placeholder="Nhập tỉnh/thành phố"
          error={getFieldError('city')}
          required
        />
        <AddressInput
          label="Mã bưu điện *"
          value={customAddress.postalCode}
          onChange={(value) => onAddressChange('postalCode', value)}
          placeholder="Nhập mã bưu điện"
          error={getFieldError('postalCode')}
          required
        />
        <AddressInput
          label="Quốc gia"
          value={customAddress.country}
          onChange={(value) => onAddressChange('country', value)}
        />
      </div>

      {/* Save Address Option */}
      <div className="flex items-center p-3 bg-blue-50 rounded-lg">
        <input
          type="checkbox"
          id="saveAddress"
          checked={saveNewAddress}
          onChange={(e) => onSaveNewAddressChange(e.target.checked)}
          className="mr-3"
        />
        <label htmlFor="saveAddress" className="flex items-center text-sm text-blue-800 cursor-pointer">
          <FaSave className="mr-2" />
          Lưu địa chỉ này vào profile để sử dụng sau này
        </label>
      </div>
    </div>
  );
};

const AddressInput = ({ label, value, onChange, placeholder, error, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
        error 
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
          : 'border-gray-300 focus:border-green-500'
      }`}
      placeholder={placeholder}
    />
    {error && (
      <p className="mt-1 text-sm text-red-600">{error}</p>
    )}
  </div>
);

export default ShippingAddress; 