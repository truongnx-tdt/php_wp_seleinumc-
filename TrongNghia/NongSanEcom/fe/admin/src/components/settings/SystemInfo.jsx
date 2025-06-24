import React from 'react';

const SystemInfo = () => {
  const systemInfo = {
    version: '1.0.0',
    buildDate: '2024-01-15',
    environment: process.env.NODE_ENV === 'production' ? 'Production' : 'Development',
    lastUpdate: '2024-01-15',
    features: [
      'Quản lý người dùng',
      'Quản lý sản phẩm',
      'Quản lý đơn hàng',
      'Quản lý danh mục',
      'Quản lý đơn vị',
      'Upload hình ảnh',
      'Phân quyền hệ thống',
      'Báo cáo thống kê',
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Thông tin hệ thống</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Phiên bản</p>
            <p className="font-medium text-gray-900">v{systemInfo.version}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Môi trường</p>
            <p className="font-medium text-gray-900">{systemInfo.environment}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Ngày build</p>
            <p className="font-medium text-gray-900">{systemInfo.buildDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Cập nhật cuối</p>
            <p className="font-medium text-gray-900">{systemInfo.lastUpdate}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">✨ Tính năng chính</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {systemInfo.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">🔧 Công nghệ sử dụng</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Frontend</p>
              <p className="font-medium">React 18, Vite, Tailwind CSS</p>
            </div>
            <div>
              <p className="text-gray-600">Backend</p>
              <p className="font-medium">Node.js, Express, MongoDB</p>
            </div>
            <div>
              <p className="text-gray-600">Authentication</p>
              <p className="font-medium">JWT, bcrypt</p>
            </div>
            <div>
              <p className="text-gray-600">File Upload</p>
              <p className="font-medium">Cloudinary</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Trạng thái hệ thống</p>
              <p className="font-medium text-green-600">Hoạt động bình thường</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemInfo; 