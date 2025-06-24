import API from './api';

// Cart API endpoints
const CART_ENDPOINTS = {
  GET: '/api/cart',
  ADD_ITEM: '/api/cart/add',
  UPDATE_ITEM: '/api/cart/update',
  REMOVE_ITEM: '/api/cart/remove',
  CLEAR: '/api/cart/clear',
  APPLY_COUPON: '/api/cart/apply-coupon',
  REMOVE_COUPON: '/api/cart/remove-coupon',
};

export const cartService = {
  // Lấy giỏ hàng
  getCart: async () => {
    const response = await API.get(CART_ENDPOINTS.GET);
    return response.data;
  },

  // Thêm sản phẩm vào giỏ hàng
  addToCart: async (productId, quantity = 1) => {
    const response = await API.post(CART_ENDPOINTS.ADD_ITEM, {
      productId,
      quantity,
    });
    return response.data;
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartItem: async (productId, quantity) => {
    const response = await API.put(CART_ENDPOINTS.UPDATE_ITEM, {
      productId,
      quantity,
    });
    return response.data;
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: async (productId) => {
    const response = await API.delete(`${CART_ENDPOINTS.REMOVE_ITEM}/${productId}`);
    return response.data;
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async () => {
    const response = await API.delete(CART_ENDPOINTS.CLEAR);
    return response.data;
  },

  // Áp dụng mã giảm giá
  applyCoupon: async (couponCode) => {
    const response = await API.post(CART_ENDPOINTS.APPLY_COUPON, {
      couponCode,
    });
    return response.data;
  },

  // Xóa mã giảm giá
  removeCoupon: async () => {
    const response = await API.delete(CART_ENDPOINTS.REMOVE_COUPON);
    return response.data;
  },

  // Lấy số lượng sản phẩm trong giỏ hàng
  getCartItemCount: async () => {
    try {
      const response = await API.get(CART_ENDPOINTS.GET);
      return response.data.items?.length || 0;
    } catch (error) {
      return 0;
    }
  },

  // Tính tổng giá trị giỏ hàng
  calculateCartTotal: (cart) => {
    if (!cart || !cart.items) return 0;
    
    return cart.items.reduce((total, item) => {
      const price = item.product.discount > 0 
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price;
      return total + (price * item.quantity);
    }, 0);
  },

  // Kiểm tra sản phẩm có trong giỏ hàng không
  isProductInCart: (cart, productId) => {
    if (!cart || !cart.items) return false;
    return cart.items.some(item => item.product._id === productId);
  },

  // Lấy số lượng sản phẩm trong giỏ hàng
  getProductQuantityInCart: (cart, productId) => {
    if (!cart || !cart.items) return 0;
    const item = cart.items.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  },
};

export default cartService; 