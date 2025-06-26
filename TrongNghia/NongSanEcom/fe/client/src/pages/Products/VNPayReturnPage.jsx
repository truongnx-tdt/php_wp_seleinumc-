import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import orderService from '../../services/orderService';
import PageTitle from '../../components/PageTitle';

const VNPayReturnPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    handleVNPayReturn();
  }, []);

  const handleVNPayReturn = async () => {
    try {
      // Lấy các tham số từ URL callback của VNPAY
      const vnpResponseCode = searchParams.get('vnp_ResponseCode');
      const vnpAmount = searchParams.get('vnp_Amount');
      const vnpTransactionNo = searchParams.get('vnp_TransactionNo');
      const vnpBankCode = searchParams.get('vnp_BankCode');
      const vnpPayDate = searchParams.get('vnp_PayDate');
      const vnpOrderInfo = searchParams.get('vnp_OrderInfo');
      const orderId = vnpOrderInfo.split(':')[1];
      const vnpTxnRef = orderId;

      // Kiểm tra mã phản hồi
      const isSuccess = vnpResponseCode === '00';
      
      const result = {
        success: isSuccess,
        orderId: orderId,
        amount: vnpAmount ? parseInt(vnpAmount) / 100 : 0, // VNPAY trả về số tiền * 100
        transactionNo: vnpTransactionNo,
        bankCode: vnpBankCode,
        payDate: vnpPayDate,
        orderInfo: vnpOrderInfo,
        responseCode: vnpResponseCode,
        message: getVNPayMessage(vnpResponseCode)
      };

      setPaymentResult(result);
      // Nếu thanh toán thành công, cập nhật trạng thái đơn hàng
      if (isSuccess && orderId) {
        try {
          await orderService.updateOrderToPaid(orderId, {
            id: vnpTransactionNo,
            status: 'completed',
            update_time: new Date().toISOString(),
            email_address: 'vnpay@payment.com'
          });
        } catch (error) {
          console.error('Error updating order:', error);
        }
      }

    } catch (error) {
      console.error('Error processing VNPAY return:', error);
      setPaymentResult({
        success: false,
        message: 'Có lỗi xảy ra khi xử lý kết quả thanh toán'
      });
    } finally {
      setLoading(false);
    }
  };

  const getVNPayMessage = (responseCode) => {
    const messages = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
      '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
    };
    return messages[responseCode] || 'Mã lỗi không xác định';
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hour = dateString.substring(8, 10);
    const minute = dateString.substring(10, 12);
    const second = dateString.substring(12, 14);
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Đang xử lý kết quả thanh toán...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <PageTitle title="Kết quả thanh toán" description="Thông tin giao dịch VNPAY" />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            {paymentResult.success ? (
              <FaCheckCircle className="text-6xl text-green-600 mx-auto mb-4" />
            ) : (
              <FaTimesCircle className="text-6xl text-red-600 mx-auto mb-4" />
            )}
            <h1 className={`text-2xl font-bold ${paymentResult.success ? 'text-green-600' : 'text-red-600'}`}>
              {paymentResult.success ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
            </h1>
            <p className="text-gray-600 mt-2">{paymentResult.message}</p>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết giao dịch</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã giao dịch:</span>
                <span className="font-medium">{paymentResult.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-medium">{formatAmount(paymentResult.amount)}</span>
              </div>
              {paymentResult.orderInfo && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Nội dung giao dịch:</span>
                  <span className="font-medium">{paymentResult.orderInfo}</span>
                </div>
              )}
              {paymentResult.bankCode && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngân hàng:</span>
                  <span className="font-medium">{paymentResult.bankCode}</span>
                </div>
              )}
              {paymentResult.payDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-medium">{formatDate(paymentResult.payDate)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Mã phản hồi:</span>
                <span className="font-medium">{paymentResult.message}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {paymentResult.success && paymentResult.orderId && (
              <button
                onClick={() => navigate(`/orders/${paymentResult.orderId}`)}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Xem đơn hàng
              </button>
            )}
            <button
              onClick={() => navigate('/products')}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition duration-300"
            >
              Tiếp tục mua sắm
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Xem đơn hàng của tôi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VNPayReturnPage;