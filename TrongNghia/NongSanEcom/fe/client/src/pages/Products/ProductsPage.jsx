import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../../utils/axiosInstance'; // giả sử bạn có axios instance

const categories = ['Rau củ', 'Trái cây', 'Ngũ cốc', 'Gia vị'];
const suppliers = ['Hợp tác xã 1', 'Hợp tác xã 2', 'Nhà cung cấp A', 'Nhà cung cấp B'];

const ProductsPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Bộ lọc
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [supplier, setSupplier] = useState(searchParams.get('supplier') || '');
    const [priceRange, setPriceRange] = useState(searchParams.get('price') || '');

    // Pagination
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [totalPages, setTotalPages] = useState(1);

    const limit = 9; // số sản phẩm trên mỗi trang

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError('');
            try {
                // Giả lập call API filter, bạn thay API thực tế
                // Gửi params query string lọc theo keyword, category, supplier, price, page
                const params = {
                    keyword,
                    category,
                    supplier,
                    priceRange,
                    page,
                    limit,
                };

                const { data } = await API.get('/api/products', { params });
                const products = data.products ? data.products : [];
                setProducts(products);
                setTotalPages(data.totalPages || 1);
            } catch (err) {
                setError('Không tải được sản phẩm');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        // Đồng bộ query params trên URL
        const paramsToSet = {};
        if (keyword) paramsToSet.keyword = keyword;
        if (category) paramsToSet.category = category;
        if (supplier) paramsToSet.supplier = supplier;
        if (priceRange) paramsToSet.price = priceRange;
        if (page) paramsToSet.page = page;

        setSearchParams(paramsToSet);
    }, [keyword, category, supplier, priceRange, page, setSearchParams]);

    // Xử lý đổi filter reset page về 1
    const onFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setPage(1);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-green-700 mb-8">Sản phẩm nông sản</h1>

                {/* Filter panel */}
                <div className="flex flex-col md:flex-row md:space-x-6 mb-10">
                    {/* Tìm kiếm */}
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        className="flex-1 mb-4 md:mb-0 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                        value={keyword}
                        onChange={onFilterChange(setKeyword)}
                    />

                    {/* Danh mục */}
                    <select
                        className="border border-gray-300 rounded px-4 py-2 mb-4 md:mb-0"
                        value={category}
                        onChange={onFilterChange(setCategory)}
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    {/* Nhà cung cấp */}
                    <select
                        className="border border-gray-300 rounded px-4 py-2 mb-4 md:mb-0"
                        value={supplier}
                        onChange={onFilterChange(setSupplier)}
                    >
                        <option value="">Tất cả nhà cung cấp</option>
                        {suppliers.map((sup) => (
                            <option key={sup} value={sup}>
                                {sup}
                            </option>
                        ))}
                    </select>

                    {/* Giá */}
                    <select
                        className="border border-gray-300 rounded px-4 py-2"
                        value={priceRange}
                        onChange={onFilterChange(setPriceRange)}
                    >
                        <option value="">Tất cả giá</option>
                        <option value="0-10000">Dưới 10,000₫</option>
                        <option value="10000-50000">10,000₫ - 50,000₫</option>
                        <option value="50000-100000">50,000₫ - 100,000₫</option>
                        <option value="100000-">Trên 100,000₫</option>
                    </select>
                </div>

                {/* Product grid */}
                {loading ? (
                    <p className="text-center text-gray-600">Đang tải sản phẩm...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : products.length === 0 ? (
                    <p className="text-center text-gray-500">Không tìm thấy sản phẩm nào.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {products.map((p) => (
                            <div
                                key={p._id}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                            >
                                <img
                                    src={p.images?.[0] || 'https://source.unsplash.com/400x250/?vegetable,fruit'}
                                    alt={p.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="text-lg font-semibold text-green-700">{p.name}</h3>
                                    <p className="text-gray-600 mt-1 text-sm">{p.category}</p>
                                    <p className="mt-2 font-semibold text-gray-900">
                                        {p.price.toLocaleString()}₫ / {p.unit}
                                    </p>
                                    {p.discount > 0 && (
                                        <p className="text-sm text-red-600 mt-1">
                                            Giảm giá: {p.discount}%
                                        </p>
                                    )}
                                    <button
                                        onClick={() => navigate(`/products/${p._id}`)}
                                        className="mt-auto bg-green-600 hover:bg-green-700 text-white py-2 rounded mt-4"
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-10 space-x-3">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className={`px-4 py-2 rounded border ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600 hover:text-white'}`}
                        >
                            &lt; Trước
                        </button>
                        {[...Array(totalPages)].map((_, idx) => {
                            const p = idx + 1;
                            return (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`px-4 py-2 rounded border ${p === page ? 'bg-green-600 text-white' : 'hover:bg-green-600 hover:text-white'
                                        }`}
                                >
                                    {p}
                                </button>
                            );
                        })}
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className={`px-4 py-2 rounded border ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600 hover:text-white'}`}
                        >
                            Tiếp &gt;
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
