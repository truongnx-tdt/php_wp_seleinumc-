import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ 
  products, 
  loading, 
  error, 
  layout = 'grid', // 'grid' for Home, 'list' for Products
  showWishlist = true,
  showAddToCart = true 
}) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào.</p>
      </div>
    );
  }

  // Grid layout for Home page
  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            showWishlist={showWishlist}
            showAddToCart={showAddToCart}
          />
        ))}
      </div>
    );
  }

  // List layout for Products page
  if (layout === 'list') {
    return (
      <div className="space-y-6">
        {products.map((product) => (
          <div key={product._id} className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
            {/* Product Image */}
            <div className="md:w-1/3 lg:w-1/4">
              <img
                src={product.images?.[0] || 'https://source.unsplash.com/400x250/?vegetable,fruit'}
                alt={product.name}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            
            {/* Product Info */}
            <div className="md:w-2/3 lg:w-3/4 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">
                  Danh mục: {product.category?.name || product.category || 'Không phân loại'}
                </p>
                <p className="text-gray-600 mb-2">
                  Nhà cung cấp: {product.user?.name || 'Không rõ'}
                </p>
                
                {/* Price */}
                <div className="mb-4">
                  {product.discount > 0 ? (
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-green-600">
                        {(product.price * (1 - product.discount / 100)).toLocaleString()}₫
                      </p>
                      <p className="text-lg text-gray-500 line-through">
                        {product.price.toLocaleString()}₫
                      </p>
                      <span className="inline-block bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                        Giảm {product.discount}%
                      </span>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-green-600">
                      {product.price.toLocaleString()}₫
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    / {product.unit?.name || product.unit || 'kg'}
                  </p>
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Stock Status */}
                {product.countInStock <= 0 ? (
                  <div className="text-red-500 font-medium mb-4">
                    Hết hàng
                  </div>
                ) : product.countInStock < 10 ? (
                  <div className="text-orange-500 font-medium mb-4">
                    Chỉ còn {product.countInStock} sản phẩm
                  </div>
                ) : null}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.href = `/products/${product._id}`}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                >
                  Xem chi tiết
                </button>
                
                {product.countInStock > 0 && (
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition duration-300"
                    title="Thêm vào giỏ hàng"
                  >
                    Thêm vào giỏ
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default ProductList; 