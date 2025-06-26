import Order from '../models/Order.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { 
  successResponse, 
  createdResponse, 
  notFoundResponse,
  validationErrorResponse,
  forbiddenResponse 
} from '../utils/responseHelper.js';
import { 
  validateOrder, 
  sanitizeInput 
} from '../utils/validationHelper.js';
import { 
  parsePaginationParams, 
  getPaginatedResults 
} from '../utils/paginate.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, ORDER_STATUS } from '../constants/index.js';
import { logger } from '../utils/logger.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';

/**
 * @desc    Create new order from cart
 * @route   POST /api/orders
 * @access  Private
 */
export const addOrderItems = asyncHandler(async (req, res) => {
  const { paymentMethod, shippingAddressId, shippingAddress: customAddress } = req.body;
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  const user = await User.findById(userId);

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('No items in cart');
  }

  let shippingAddress;
  
  // Nếu có địa chỉ tùy chỉnh từ frontend
  if (customAddress) {
    shippingAddress = customAddress;
  } 
  // Nếu có shippingAddressId, lấy từ user addresses
  else if (shippingAddressId) {
    shippingAddress = user.addresses.id(shippingAddressId);
    if (!shippingAddress) {
      res.status(400);
      throw new Error('Shipping address not found');
    }
  } 
  // Lấy địa chỉ mặc định
  else {
    shippingAddress = user.addresses.find(addr => addr.isDefault);
  }

  if (!shippingAddress) {
    res.status(400);
    throw new Error('No shipping address selected or default address found');
  }

  const orderItems = cart.items.map(item => ({
    name: item.product.name,
    qty: item.quantity,
    image: item.product.images[0],
    price: item.price,
    product: item.product._id,
  }));

  const itemsPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 500000 ? 0 : 30000; // Example shipping logic
  const taxPrice = 0; // No tax for now
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = new Order({
    user: userId,
    orderItems,
    shippingAddress: {
      street: shippingAddress.street,
      city: shippingAddress.city,
      district: shippingAddress.district,
      ward: shippingAddress.ward,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country,
    },
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  // Clear cart after order is created
  cart.items = [];
  await cart.save();

  res.status(201).json(createdOrder);
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  
  if (order && (req.user.role === 'admin' || order.user._id.equals(req.user._id))) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/orders/myorders
 * @access  Private
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const paginationParams = parsePaginationParams(req.query);
  
  const result = await getPaginatedResults(
    Order, 
    { user: req.user._id }, 
    paginationParams, 
    { createdAt: -1 }
  );

  return successResponse(res, {
    orders: result.data,
    pagination: result.pagination,
  });
});

/**
 * @desc    Get all orders (admin)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
export const getOrders = asyncHandler(async (req, res) => {
  const { status = '', search = '' } = req.query;
  const paginationParams = parsePaginationParams(req.query);
  
  // Build filter
  const filter = {};
  if (status) {
    filter.status = status;
  }
  if (search) {
    filter.$or = [
      { 'user.name': { $regex: search, $options: 'i' } },
      { 'user.email': { $regex: search, $options: 'i' } },
    ];
  }

  const result = await getPaginatedResults(
    Order, 
    filter, 
    paginationParams, 
    { createdAt: -1 }
  );

  // Populate user data
  const populatedOrders = await Order.populate(result.data, {
    path: 'user',
    select: 'name email',
  });

  return successResponse(res, {
    orders: populatedOrders,
    pagination: result.pagination,
  });
});

/**
 * @desc    Update order to paid
 * @route   PUT /api/orders/:id/pay
 * @access  Private
 */
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = { // This data would come from the payment provider (e.g. PayPal, Stripe)
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

/**
 * @desc    Update order to delivered
 * @route   PUT /api/orders/:id/deliver
 * @access  Private/Admin
 */
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return notFoundResponse(res, ERROR_MESSAGES.ORDER_NOT_FOUND);
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.status = ORDER_STATUS.DELIVERED;

  const updatedOrder = await order.save();

  logger.info('Order marked as delivered', {
    orderId: order._id,
    updatedBy: req.user._id,
  });

  return successResponse(res, updatedOrder, 'Order marked as delivered');
});

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return notFoundResponse(res, ERROR_MESSAGES.ORDER_NOT_FOUND);
  }

  // Validate status
  if (!Object.values(ORDER_STATUS).includes(status)) {
    return validationErrorResponse(res, { status: 'Invalid order status' });
  }

  order.status = status;
  
  // Update related fields based on status
  if (status === ORDER_STATUS.CONFIRMED && !order.isPaid) {
    order.isPaid = true;
    order.paidAt = Date.now();
  }
  
  if (status === ORDER_STATUS.DELIVERED && !order.isDelivered) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();

  logger.info('Order status updated', {
    orderId: order._id,
    updatedBy: req.user._id,
    oldStatus: order.status,
    newStatus: status,
  });

  return successResponse(res, updatedOrder, 'Order status updated successfully');
});

/**
 * @desc    Get order statistics
 * @route   GET /api/orders/stats
 * @access  Private/Admin
 */
export const getOrderStats = asyncHandler(async (req, res) => {
  const [totalOrders, pendingOrders, confirmedOrders, deliveredOrders, cancelledOrders] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: ORDER_STATUS.PENDING }),
    Order.countDocuments({ status: ORDER_STATUS.CONFIRMED }),
    Order.countDocuments({ status: ORDER_STATUS.DELIVERED }),
    Order.countDocuments({ status: ORDER_STATUS.CANCELLED }),
  ]);

  // Get total revenue
  const revenueResult = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);

  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  // Get recent orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email')
    .select('totalPrice status createdAt');

  return successResponse(res, {
    stats: {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
    },
    recentOrders,
  });
}); 