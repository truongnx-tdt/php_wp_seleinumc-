import API from './api';

// Order API endpoints
const ORDER_ENDPOINTS = {
  CREATE: '/api/orders',
  GET_BY_ID: '/api/orders', // base, will append /:id
  GET_MY_ORDERS: '/api/orders/myorders',
  UPDATE_TO_PAID: '/api/orders', // base, will append /:id/pay
  CHECK_INVENTORY: '/api/orders/check-inventory',
};

export const orderService = {
  // Kiểm tra tồn kho trước khi đặt hàng
  checkInventory: async () => {
    const response = await API.post(ORDER_ENDPOINTS.CHECK_INVENTORY);
    return response.data;
  },

  // Tạo đơn hàng mới
  createOrder: async (orderData) => {
    const response = await API.post(ORDER_ENDPOINTS.CREATE, orderData);
    return response.data;
  },

  // Lấy đơn hàng theo ID
  getOrderById: async (orderId) => {
    const response = await API.get(`${ORDER_ENDPOINTS.GET_BY_ID}/${orderId}`);
    return response.data;
  },

  // Lấy danh sách đơn hàng của user
  getMyOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${ORDER_ENDPOINTS.GET_MY_ORDERS}?${queryString}` : ORDER_ENDPOINTS.GET_MY_ORDERS;
    const response = await API.get(url);
    return response.data;
  },

  // Cập nhật trạng thái thanh toán
  updateOrderToPaid: async (orderId, paymentData) => {
    const response = await API.put(`${ORDER_ENDPOINTS.UPDATE_TO_PAID}/${orderId}/pay`, paymentData);
    return response.data;
  },
};

export default orderService; 