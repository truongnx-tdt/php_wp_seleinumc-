import API from './api';

// Cart API endpoints
const CART_ENDPOINTS = {
  GET: '/api/cart',
  ADD_ITEM: '/api/cart/items',
  UPDATE_ITEM: '/api/cart/items',
  REMOVE_ITEM: '/api/cart/items',
  CLEAR: '/api/cart',
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
    const response = await API.put(`${CART_ENDPOINTS.UPDATE_ITEM}/${productId}`, {
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

  // Lấy số lượng sản phẩm trong giỏ hàng
  getCartItemCount: async () => {
    try {
      const response = await API.get(CART_ENDPOINTS.GET);
      const items = response.data.items || [];
      // Tổng quantity của tất cả item
      return items.reduce((sum, item) => sum + item.quantity, 0);
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