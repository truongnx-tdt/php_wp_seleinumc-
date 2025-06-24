import React from 'react';

const SecurityInfo = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
      <h4 className="text-lg font-semibold text-blue-900 mb-4">🔒 Thông tin bảo mật</h4>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5">
            ✓
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">Xác thực hai yếu tố</p>
            <p className="text-xs text-blue-700">Bảo vệ tài khoản bằng mã xác thực</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5">
            ✓
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">Mã hóa dữ liệu</p>
            <p className="text-xs text-blue-700">Tất cả dữ liệu được mã hóa SSL/TLS</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5">
            ✓
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">Sao lưu tự động</p>
            <p className="text-xs text-blue-700">Dữ liệu được sao lưu hàng ngày</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5">
            !
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">Cập nhật mật khẩu</p>
            <p className="text-xs text-blue-700">Nên thay đổi mật khẩu định kỳ</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-blue-200">
        <h5 className="text-sm font-medium text-blue-900 mb-2">💡 Lời khuyên bảo mật</h5>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Sử dụng mật khẩu mạnh với ít nhất 8 ký tự</li>
          <li>• Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
          <li>• Không sử dụng thông tin cá nhân trong mật khẩu</li>
          <li>• Không chia sẻ mật khẩu với bất kỳ ai</li>
          <li>• Đăng xuất khi không sử dụng</li>
        </ul>
      </div>
    </div>
  );
};

export default SecurityInfo; 