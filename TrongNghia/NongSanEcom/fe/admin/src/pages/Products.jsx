import React from 'react';

const products = [
  { id: 1, name: 'Gạo ST25', price: 25000, stock: 100, status: 'Hiển thị' },
  { id: 2, name: 'Xoài Cát Chu', price: 40000, stock: 50, status: 'Ẩn' },
];

const Products = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Quản trị sản phẩm</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow text-sm sm:text-base">
        <thead>
          <tr>
            <th className="py-2 px-2 sm:px-4 border-b">Tên sản phẩm</th>
            <th className="py-2 px-2 sm:px-4 border-b">Giá</th>
            <th className="py-2 px-2 sm:px-4 border-b">Tồn kho</th>
            <th className="py-2 px-2 sm:px-4 border-b">Trạng thái</th>
            <th className="py-2 px-2 sm:px-4 border-b">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="py-2 px-2 sm:px-4 border-b">{p.name}</td>
              <td className="py-2 px-2 sm:px-4 border-b">{p.price.toLocaleString()}₫</td>
              <td className="py-2 px-2 sm:px-4 border-b">{p.stock}</td>
              <td className="py-2 px-2 sm:px-4 border-b">{p.status}</td>
              <td className="py-2 px-2 sm:px-4 border-b">
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Sửa</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Products; 