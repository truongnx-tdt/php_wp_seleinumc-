// src/pages/AboutPage.jsx
import React from 'react';
import PageTitle from '../../components/PageTitle';

const AboutPage = () => {
  return (
    <>
      <PageTitle 
        title="Giới thiệu" 
        description="Tìm hiểu về Nông Sản Ecom - nền tảng thương mại điện tử chuyên cung cấp các loại nông sản sạch, hữu cơ và chất lượng cao từ các vùng miền trên khắp cả nước."
      />
      
      <div className="bg-white min-h-screen py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-green-700 mb-6">Giới thiệu về Nông Sản Ecom</h1>
          <p className="text-gray-700 text-lg mb-4">
            Nông Sản Ecom là nền tảng thương mại điện tử chuyên cung cấp các loại nông sản sạch, hữu cơ và chất lượng cao từ các vùng miền trên khắp cả nước.
          </p>
          <p className="text-gray-600">
            Với sứ mệnh kết nối nông dân và người tiêu dùng, chúng tôi mong muốn tạo ra hệ sinh thái bền vững, minh bạch và công bằng. Tất cả sản phẩm đều được kiểm định, truy xuất nguồn gốc rõ ràng và vận chuyển nhanh chóng đến tận tay khách hàng.
          </p>
          <div className="mt-10">
            <img
              src="https://source.unsplash.com/800x400/?organic,farm,vegetable"
              alt="Nông sản"
              className="rounded-lg shadow-md mx-auto"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
