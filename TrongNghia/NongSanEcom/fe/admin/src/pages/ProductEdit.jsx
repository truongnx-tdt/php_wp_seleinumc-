import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('adminUser'))?.token;

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Không tìm thấy sản phẩm');

        setForm({
          name: data.name,
          price: data.price,
          countInStock: data.countInStock,
          category: data.category,
          unit: data.unit,
          description: data.description,
          origin: data.origin,
          discount: data.discount || '',
        });
        setImages(data.images || []);
      } catch (err) {
        toast.error(err.message);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate, token]);

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
        const res = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Upload ảnh thất bại');
        urls.push(data.url);
      } catch (err) {
        toast.error(err.message);
      }
    }

    setImages(urls);
    setUploading(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...form,
        price: Number(form.price),
        countInStock: Number(form.countInStock),
        discount: Number(form.discount) || 0,
        images,
      };
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Cập nhật thất bại');
      toast.success('Cập nhật sản phẩm thành công!');
      navigate('/products');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Đang tải sản phẩm...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-10 border border-gray-200">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900 tracking-wide">
        Chỉnh sửa sản phẩm
      </h2>

      <form onSubmit={submitHandler} className="space-y-6">
        {/* Tên + Giá */}
        <div className="flex flex-col sm:flex-row sm:space-x-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-300"
              required
            />
          </div>
          <div className="flex-1 mt-4 sm:mt-0">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Giá (VNĐ) <span className="text-red-500">*</span>
            </label>
            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-300"
              required
            />
          </div>
        </div>

        {/* Tồn kho + Đơn vị */}
        <div className="flex flex-col sm:flex-row sm:space-x-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Tồn kho <span className="text-red-500">*</span>
            </label>
            <input
              name="countInStock"
              type="number"
              min="0"
              value={form.countInStock}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-300"
              required
            />
          </div>
          <div className="flex-1 mt-4 sm:mt-0">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Đơn vị</label>
            <input
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>

        {/* Danh mục + Xuất xứ + Giảm giá */}
        <div className="flex flex-col sm:flex-row sm:space-x-6">
          {['category', 'origin', 'discount'].map((field, idx) => (
            <div key={idx} className="flex-1 mt-4 sm:mt-0">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                {field === 'category' ? 'Danh mục' : field === 'origin' ? 'Xuất xứ' : 'Giảm giá (%)'}
              </label>
              <input
                name={field}
                type={field === 'discount' ? 'number' : 'text'}
                min={field === 'discount' ? '0' : undefined}
                max={field === 'discount' ? '100' : undefined}
                value={form[field]}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-300"
              />
            </div>
          ))}
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Mô tả sản phẩm</label>
          <textarea
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-300 resize-none"
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
            className="block w-full text-gray-600 file:border-0 file:bg-green-600 file:text-white file:px-4 py-2 file:rounded-md hover:file:bg-green-700"
          />
          {uploading && <p className="text-green-600 mt-2 animate-pulse">Đang tải ảnh...</p>}
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {images.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Ảnh ${idx + 1}`}
                  className="w-full h-28 object-cover rounded-md shadow-md"
                />
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-6 py-3 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 transition font-semibold"
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
            Cập nhật sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
