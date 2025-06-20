import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000';

const ProductCreate = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    countInStock: '',
    category: '',
    unit: '',
    description: '',
    origin: '',
    discount: '',
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem('adminUser'))?.token;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadImages = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    const urls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await fetch(API_URL + '/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Upload ảnh thất bại');
        }

        const data = await res.json();
        urls.push(data.url);
      } catch (err) {
        toast.error(err.message);
        console.error('Upload error:', err);
      }
    }

    setImages(urls);
    setUploading(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.countInStock) {
      toast.warn('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      const productData = {
        ...form,
        price: Number(form.price),
        countInStock: Number(form.countInStock),
        discount: Number(form.discount) || 0,
        images,
      };

      const res = await fetch(API_URL + '/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Thêm sản phẩm thất bại');
      }

      toast.success('Thêm sản phẩm thành công!');
      navigate('/products');
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-10 border border-gray-200">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900 tracking-wide">
        Thêm sản phẩm mới
      </h2>

      <form onSubmit={submitHandler} className="space-y-6">
        {/* Row: Name + Price */}
        <div className="flex flex-col sm:flex-row sm:space-x-6">
          <div className="flex-1">
            <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-700">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập tên sản phẩm"
              className="w-full rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-300 transition"
              required
            />
          </div>

          <div className="flex-1 mt-4 sm:mt-0">
            <label htmlFor="price" className="block text-sm font-semibold mb-2 text-gray-700">
              Giá (VNĐ) <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              placeholder="Nhập giá"
              className="w-full rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-300 transition"
              required
            />
          </div>
        </div>

        {/* Row: CountInStock + Unit */}
        <div className="flex flex-col sm:flex-row sm:space-x-6">
          <div className="flex-1">
            <label htmlFor="countInStock" className="block text-sm font-semibold mb-2 text-gray-700">
              Tồn kho <span className="text-red-500">*</span>
            </label>
            <input
              id="countInStock"
              name="countInStock"
              type="number"
              min="0"
              value={form.countInStock}
              onChange={handleChange}
              placeholder="Số lượng trong kho"
              className="w-full rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-300 transition"
              required
            />
          </div>

          <div className="flex-1 mt-4 sm:mt-0">
            <label htmlFor="unit" className="block text-sm font-semibold mb-2 text-gray-700">
              Đơn vị
            </label>
            <input
              id="unit"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              placeholder="Ví dụ: kg, chai, lon..."
              className="w-full rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-300 transition"
            />
          </div>
        </div>

        {/* Row: Category + Origin + Discount */}
        <div className="flex flex-col sm:flex-row sm:space-x-6">
          <div className="flex-1">
            <label htmlFor="category" className="block text-sm font-semibold mb-2 text-gray-700">
              Danh mục
            </label>
            <input
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Danh mục sản phẩm"
              className="w-full rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-300 transition"
            />
          </div>

          <div className="flex-1 mt-4 sm:mt-0">
            <label htmlFor="origin" className="block text-sm font-semibold mb-2 text-gray-700">
              Xuất xứ
            </label>
            <input
              id="origin"
              name="origin"
              value={form.origin}
              onChange={handleChange}
              placeholder="Nơi sản xuất"
              className="w-full rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-300 transition"
            />
          </div>

          <div className="flex-1 mt-4 sm:mt-0">
            <label htmlFor="discount" className="block text-sm font-semibold mb-2 text-gray-700">
              Giảm giá (%)
            </label>
            <input
              id="discount"
              name="discount"
              type="number"
              min="0"
              max="100"
              value={form.discount}
              onChange={handleChange}
              placeholder="0"
              className="w-full rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-300 transition"
            />
          </div>
        </div>

        {/* Mô tả */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold mb-2 text-gray-700">
            Mô tả sản phẩm
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            placeholder="Mô tả chi tiết sản phẩm"
            className="w-full rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-300 transition resize-none"
          />
        </div>

        {/* Upload ảnh */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Ảnh sản phẩm</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={uploadImages}
            className="block w-full text-gray-600 file:border-0 file:bg-green-600 file:text-white file:px-4 file:py-2 file:rounded-md file:cursor-pointer hover:file:bg-green-700 transition"
          />
          {uploading && (
            <p className="text-green-600 mt-2 font-medium animate-pulse">Đang tải ảnh...</p>
          )}
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {images.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Ảnh sản phẩm ${idx + 1}`}
                  className="rounded-md shadow-md object-cover w-full h-28"
                />
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-6 py-3 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition font-semibold"
          >
            Quay lại
          </button>

          <button
            type="submit"
            disabled={uploading}
            className={`px-8 py-3 rounded-md font-semibold text-white ${
              uploading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            } transition`}
          >
            Thêm sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;
