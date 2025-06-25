import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaLeaf, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import cartService from '../services/cartService';
import { useUser } from '../UserContext';

const ProductCard = ({ product, showWishlist = true, showAddToCart = true }) => {
  const navigate = useNavigate();
  const { user, updateCartCount } = useUser();
  const [adding, setAdding] = useState(false);

  const calculateDiscountedPrice = (price, discount) => {
    return price * (1 - discount / 100);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Helper function để lấy tên category
  const getCategoryName = (category) => {
    if (typeof category === 'string') return category;
    if (category && typeof category === 'object' && category.name) return category.name;
    return 'Không phân loại';
  };

  // Helper function để lấy tên unit
  const getUnitName = (unit) => {
    if (typeof unit === 'string') return unit;
    if (unit && typeof unit === 'object' && unit.name) return unit.name;
    if (unit && typeof unit === 'object' && unit.symbol) return unit.symbol;
    return 'kg';
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.info('Vui lòng đăng nhập để thêm vào giỏ hàng!');
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await cartService.addToCart(product._id, 1);
      updateCartCount && updateCartCount();
      toast.success('Đã thêm vào giỏ hàng!');
    } catch (err) {
      toast.error('Thêm vào giỏ hàng thất bại!');
    } finally {
      setAdding(false);
    }
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    // TODO: Implement add to wishlist functionality
    console.log('Add to wishlist:', product._id);
  };

  const handleProductClick = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden group cursor-pointer"
      onClick={handleProductClick}
    >
      <div className="relative">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
        />
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
            -{product.discount}%
          </div>
        )}
        
        {/* Organic Badge */}
        {product.isOrganic && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm">
            <FaLeaf className="inline mr-1" />
            Hữu cơ
          </div>
        )}
        
        {/* Wishlist Button */}
        {showWishlist && (
          <button
            onClick={handleAddToWishlist}
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-red-50"
          >
            <FaHeart className="text-gray-400 hover:text-red-500 transition-colors duration-200" />
          </button>
        )}
      </div>
      
      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-green-600 transition-colors duration-200">
          {product.name}
        </h3>
        
        {/* Category */}
        <p className="text-gray-600 text-sm mb-2">
          {getCategoryName(product.category)}
        </p>
        
        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">({product.numReviews || 0})</span>
          </div>
        )}

        {/* Price */}
        <div className="mb-3">
          {product.discount > 0 ? (
            <div className="space-y-1">
              <p className="text-lg font-bold text-green-600">
                {formatPrice(calculateDiscountedPrice(product.price, product.discount))}₫
              </p>
              <p className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}₫
              </p>
            </div>
          ) : (
            <p className="text-lg font-bold text-green-600">
              {formatPrice(product.price)}₫
            </p>
          )}
          <p className="text-sm text-gray-500">/ {getUnitName(product.unit)}</p>
        </div>

        {/* Stock Status */}
        {product.countInStock <= 0 ? (
          <div className="text-red-500 text-sm font-medium mb-3">
            Hết hàng
          </div>
        ) : product.countInStock < 10 ? (
          <div className="text-orange-500 text-sm font-medium mb-3">
            Chỉ còn {product.countInStock} sản phẩm
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleProductClick}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Xem chi tiết
          </button>
          
          {showAddToCart && product.countInStock > 0 && (
            <button
              onClick={handleAddToCart}
              className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg transition duration-300 min-w-[44px] flex items-center justify-center"
              title="Thêm vào giỏ hàng"
              disabled={adding}
            >
              {adding ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <FaShoppingCart className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 