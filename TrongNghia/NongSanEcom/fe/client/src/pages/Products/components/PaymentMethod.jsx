import React from 'react';
import { FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';

const PaymentMethod = ({ paymentMethod, onPaymentMethodChange, showError = false }) => {
  const paymentOptions = [
    {
      value: 'COD',
      icon: FaMoneyBillWave,
      title: 'Thanh toán khi nhận hàng (COD)',
      description: 'Thanh toán bằng tiền mặt khi nhận hàng',
      iconColor: 'text-green-600'
    },
    {
      value: 'VNPAY',
      icon: FaCreditCard,
      title: 'Thanh toán qua VNPAY',
      description: 'Thanh toán trực tuyến an toàn qua VNPAY',
      iconColor: 'text-blue-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <FaCreditCard className="text-green-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">Phương thức thanh toán</h2>
      </div>
      
      <div className="space-y-3">
        {paymentOptions.map((option) => (
          <PaymentOption
            key={option.value}
            option={option}
            isSelected={paymentMethod === option.value}
            onChange={onPaymentMethodChange}
          />
        ))}
      </div>

      {/* Error message */}
      {showError && !paymentMethod && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            Vui lòng chọn phương thức thanh toán
          </p>
        </div>
      )}
    </div>
  );
};

const PaymentOption = ({ option, isSelected, onChange }) => {
  const IconComponent = option.icon;
  
  return (
    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
      <input
        type="radio"
        name="payment"
        value={option.value}
        checked={isSelected}
        onChange={(e) => onChange(e.target.value)}
        className="mr-3"
      />
      <div className="flex items-center flex-1">
        <IconComponent className={`${option.iconColor} mr-3 text-xl`} />
        <div>
          <div className="font-medium">{option.title}</div>
          <div className="text-sm text-gray-500">{option.description}</div>
        </div>
      </div>
    </label>
  );
};

export default PaymentMethod; 