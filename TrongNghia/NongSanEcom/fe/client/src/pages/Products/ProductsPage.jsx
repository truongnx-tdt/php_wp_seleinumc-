import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import ProductList from '../../components/ProductList';

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // State cho sản phẩm
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // State cho danh mục
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    // Bộ lọc
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [debouncedKeyword, setDebouncedKeyword] = useState(searchParams.get('keyword') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');
    const [priceRange, setPriceRange] = useState(searchParams.get('price') || '');

    // Pagination
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    const limit = 8; // số sản phẩm trên mỗi trang

    // Debounce cho keyword search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(keyword);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [keyword]);

    // Lấy danh mục từ API
    useEffect(() => {
        const fetchCategories = async () => {
            setCategoriesLoading(true);
            try {
                const response = await categoryService.getCategories({ limit: 50 });
                setCategories(response.categories || response.data || []);
            } catch (err) {
                console.error('Lỗi khi tải danh mục:', err);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Lấy sản phẩm từ API
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError('');
            try {
                // Xử lý price range
                let minPrice, maxPrice;
                if (priceRange) {
                    const [min, max] = priceRange.split('-');
                    minPrice = min;
                    maxPrice = max || '';
                }

                // Xử lý sort
                let sort, order;
                if (sortBy) {
                    switch (sortBy) {
                        case 'price-asc':
                            sort = 'price';
                            order = 'asc';
                            break;
                        case 'price-desc':
                            sort = 'price';
                            order = 'desc';
                            break;
                        case 'name-asc':
                            sort = 'name';
                            order = 'asc';
                            break;
                        case 'name-desc':
                            sort = 'name';
                            order = 'desc';
                            break;
                        case 'newest':
                            sort = 'createdAt';
                            order = 'desc';
                            break;
                        case 'oldest':
                            sort = 'createdAt';
                            order = 'asc';
                            break;
                        default:
                            sort = '';
                            order = '';
                    }
                }

                const params = {
                    pageNumber: page,
                    pageSize: limit,
                    keyword: debouncedKeyword.trim(),
                    category: category,
                    sort,
                    order,
                    minPrice,
                    maxPrice,
                };

                console.log('API Params:', params);
                const response = await productService.getProducts(params);
                console.log('API Response:', response);
                
                // Xử lý response theo format API
                const productsData = response.products || response.data || [];
                const totalPagesData = response.totalPages || response.pages || 1;
                const totalProductsData = response.totalProducts || response.total || 0;

                setProducts(productsData);
                setTotalPages(totalPagesData);
                setTotalProducts(totalProductsData);
            } catch (err) {
                console.error('Lỗi khi tải sản phẩm:', err);
                setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        // Cập nhật URL params
        const paramsToSet = {};
        if (debouncedKeyword.trim()) paramsToSet.keyword = debouncedKeyword.trim();
        if (category) paramsToSet.category = category;
        if (sortBy) paramsToSet.sort = sortBy;
        if (priceRange) paramsToSet.price = priceRange;
        if (page > 1) paramsToSet.page = page;

        setSearchParams(paramsToSet);
    }, [debouncedKeyword, category, sortBy, priceRange, page, setSearchParams]);

    // Xử lý thay đổi filter
    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setPage(1);
    };

    // Reset tất cả filter
    const resetFilters = () => {
        setKeyword('');
        setDebouncedKeyword('');
        setCategory('');
        setSortBy('');
        setPriceRange('');
        setPage(1);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <h1 className="text-4xl font-bold text-green-700 mb-4 md:mb-0">
                        Sản phẩm nông sản
                    </h1>
                    <div className="text-gray-600">
                        Tìm thấy {totalProducts} sản phẩm
                        {totalPages > 1 && ` (Trang ${page}/${totalPages})`}
                    </div>
                </div>

                {/* Filter panel */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* Tìm kiếm */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tìm kiếm
                            </label>
                            <input
                                type="text"
                                placeholder="Tên sản phẩm..."
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                                value={keyword}
                                onChange={handleFilterChange(setKeyword)}
                            />
                            {keyword !== debouncedKeyword && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Đang tìm kiếm...
                                </p>
                            )}
                        </div>

                        {/* Danh mục */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Danh mục
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                                value={category}
                                onChange={handleFilterChange(setCategory)}
                                disabled={categoriesLoading}
                            >
                                <option value="">Tất cả danh mục</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sắp xếp */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sắp xếp
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                                value={sortBy}
                                onChange={handleFilterChange(setSortBy)}
                            >
                                <option value="">Mặc định</option>
                                <option value="name-asc">Tên A-Z</option>
                                <option value="name-desc">Tên Z-A</option>
                                <option value="price-asc">Giá tăng dần</option>
                                <option value="price-desc">Giá giảm dần</option>
                                <option value="newest">Mới nhất</option>
                                <option value="oldest">Cũ nhất</option>
                            </select>
                        </div>

                        {/* Khoảng giá */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Khoảng giá
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                                value={priceRange}
                                onChange={handleFilterChange(setPriceRange)}
                            >
                                <option value="">Tất cả giá</option>
                                <option value="0-10000">Dưới 10,000₫</option>
                                <option value="10000-50000">10,000₫ - 50,000₫</option>
                                <option value="50000-100000">50,000₫ - 100,000₫</option>
                                <option value="100000-200000">100,000₫ - 200,000₫</option>
                                <option value="200000-">Trên 200,000₫</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {/* Reset button */}
                        <button
                            onClick={resetFilters}
                            className="text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                            Xóa bộ lọc
                        </button>

                        {/* Products per page info */}
                        <div className="text-sm text-gray-500">
                            Hiển thị {products.length} sản phẩm / trang
                        </div>
                    </div>
                </div>

                {/* Product List */}
                <ProductList 
                    products={products}
                    loading={loading}
                    error={error}
                    layout="grid"
                    showWishlist={false}
                    showAddToCart={true}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-10 space-x-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className={`px-4 py-2 rounded-lg border transition-colors ${page === 1
                                ? 'opacity-50 cursor-not-allowed bg-gray-100'
                                : 'hover:bg-green-600 hover:text-white hover:border-green-600'
                            }`}
                        >
                            &lt; Trước
                        </button>
                        
                        {/* Page numbers */}
                        {[...Array(totalPages)].map((_, idx) => {
                            const p = idx + 1;
                            // Chỉ hiển thị một số trang xung quanh trang hiện tại
                            if (
                                p === 1 || 
                                p === totalPages || 
                                (p >= page - 1 && p <= page + 1)
                            ) {
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`px-4 py-2 rounded-lg border transition-colors ${p === page
                                                ? 'bg-green-600 text-white border-green-600'
                                                : 'hover:bg-green-600 hover:text-white hover:border-green-600'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                );
                            } else if (
                                p === page - 2 || 
                                p === page + 2
                            ) {
                                return <span key={p} className="px-2 py-2">...</span>;
                            }
                            return null;
                        })}
                        
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className={`px-4 py-2 rounded-lg border transition-colors ${page === totalPages
                                ? 'opacity-50 cursor-not-allowed bg-gray-100'
                                : 'hover:bg-green-600 hover:text-white hover:border-green-600'
                            }`}
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
