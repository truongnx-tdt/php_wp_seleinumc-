import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilter, FaSort } from 'react-icons/fa';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import ProductCard from '../../components/ProductCard';
import { PageSpinner, ProductSpinner } from '../../components/Spinner';
import PageTitle from '../../components/PageTitle';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  // Lấy params từ URL
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order') || 'desc';
  const page = parseInt(searchParams.get('page')) || 1;

  // Sử dụng custom hooks
  const {
    products,
    loading,
    error,
    pagination,
    updateParams,
    changePage,
    resetFilters,
  } = useProducts({
    keyword,
    category,
    sort,
    order,
  });

  const {
    categories,
    loading: categoriesLoading,
    fetchCategoriesWithProducts,
  } = useCategories();

  useEffect(() => {
    fetchCategoriesWithProducts();
  }, [fetchCategoriesWithProducts]);

  // Cập nhật URL khi params thay đổi
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (keyword) newParams.set('keyword', keyword);
    if (category) newParams.set('category', category);
    if (sort) newParams.set('sort', sort);
    if (order) newParams.set('order', order);
    if (page > 1) newParams.set('page', page.toString());
    
    setSearchParams(newParams);
  }, [keyword, category, sort, order, page, setSearchParams]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchKeyword = formData.get('search');
    updateParams({ keyword: searchKeyword });
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    updateParams({ [filterType]: value });
  };

  // Handle sort changes
  const handleSortChange = (newSort, newOrder) => {
    updateParams({ sort: newSort, order: newOrder });
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    changePage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && page === 1) {
    return <PageSpinner />;
  }

  return (
    <>
      <PageTitle 
        title="Sản phẩm" 
        description="Khám phá đa dạng các loại nông sản tươi ngon, chất lượng cao. Từ rau củ quả đến trái cây, gạo và ngũ cốc - tất cả đều được chọn lọc kỹ lưỡng."
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sản phẩm nông sản
            </h1>
            <p className="text-gray-600">
              Khám phá đa dạng các loại nông sản tươi ngon, chất lượng cao
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                  >
                    <FaFilter className="w-4 h-4" />
                  </button>
                </div>

                <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
                  {/* Search */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Tìm kiếm</h3>
                    <form onSubmit={handleSearch}>
                      <div className="relative">
                        <input
                          type="text"
                          name="search"
                          defaultValue={keyword}
                          placeholder="Tìm sản phẩm..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </form>
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Danh mục</h3>
                    <select
                      value={category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Tất cả danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name} ({cat.productCount || 0})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Sắp xếp</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleSortChange('createdAt', 'desc')}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          sort === 'createdAt' && order === 'desc'
                            ? 'bg-green-100 text-green-800'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        Mới nhất
                      </button>
                      <button
                        onClick={() => handleSortChange('price', 'asc')}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          sort === 'price' && order === 'asc'
                            ? 'bg-green-100 text-green-800'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        Giá tăng dần
                      </button>
                      <button
                        onClick={() => handleSortChange('price', 'desc')}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          sort === 'price' && order === 'desc'
                            ? 'bg-green-100 text-green-800'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        Giá giảm dần
                      </button>
                      <button
                        onClick={() => handleSortChange('name', 'asc')}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          sort === 'name' && order === 'asc'
                            ? 'bg-green-100 text-green-800'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        Tên A-Z
                      </button>
                    </div>
                  </div>

                  {/* Reset Filters */}
                  <button
                    onClick={resetFilters}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                  <p className="text-gray-600">
                    Hiển thị {products.length} sản phẩm
                    {pagination.total > 0 && ` trong tổng số ${pagination.total} sản phẩm`}
                  </p>
                  {(keyword || category) && (
                    <p className="text-sm text-gray-500 mt-1">
                      Kết quả tìm kiếm cho: {keyword && `"${keyword}"`} {category && `danh mục: ${categories.find(c => c._id === category)?.name}`}
                    </p>
                  )}
                </div>
              </div>

              {/* Products Grid */}
              {error ? (
                <div className="text-center py-12">
                  <p className="text-red-500 text-lg mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                  >
                    Thử lại
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">Không tìm thấy sản phẩm nào</p>
                  <button
                    onClick={resetFilters}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                  >
                    Xem tất cả sản phẩm
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <nav className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Trước
                        </button>
                        
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                          .filter(pageNum => 
                            pageNum === 1 || 
                            pageNum === pagination.totalPages || 
                            Math.abs(pageNum - pagination.page) <= 1
                          )
                          .map((pageNum, index, array) => (
                            <React.Fragment key={pageNum}>
                              {index > 0 && array[index - 1] !== pageNum - 1 && (
                                <span className="px-3 py-2 text-sm text-gray-500">...</span>
                              )}
                              <button
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-3 py-2 text-sm font-medium rounded-md ${
                                  pageNum === pagination.page
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            </React.Fragment>
                          ))}
                        
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.totalPages}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Sau
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}

              {/* Loading indicator for pagination */}
              {loading && page > 1 && (
                <div className="mt-6">
                  <ProductSpinner />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products; 