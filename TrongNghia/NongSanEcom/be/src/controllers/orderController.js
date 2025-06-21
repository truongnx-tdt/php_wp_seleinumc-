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

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
export const addOrder = asyncHandler(async (req, res) => {
  const sanitizedData = sanitizeInput(req.body);
  
  // Validate input
  const validationErrors = validateOrder(sanitizedData);
  if (validationErrors) {
    return validationErrorResponse(res, validationErrors);
  }

  const { 
    orderItems, 
    shippingAddress, 
    paymentMethod, 
    itemsPrice, 
    taxPrice, 
    shippingPrice, 
    totalPrice 
  } = sanitizedData;

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice: parseFloat(itemsPrice),
    taxPrice: parseFloat(taxPrice) || 0,
    shippingPrice: parseFloat(shippingPrice) || 0,
    totalPrice: parseFloat(totalPrice),
  });

  const createdOrder = await order.save();

  logger.info('Order created successfully', {
    orderId: createdOrder._id,
    userId: req.user._id,
    totalPrice: createdOrder.totalPrice,
  });

  return createdResponse(res, createdOrder, SUCCESS_MESSAGES.ORDER_CREATED);
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  
  if (!order) {
    return notFoundResponse(res, ERROR_MESSAGES.ORDER_NOT_FOUND);
  }

  // Check authorization
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return forbiddenResponse(res, 'Not authorized to view this order');
  }

  return successResponse(res, order);
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
  
  if (!order) {
    return notFoundResponse(res, ERROR_MESSAGES.ORDER_NOT_FOUND);
  }

  // Check if user owns this order or is admin
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return forbiddenResponse(res, 'Not authorized to update this order');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = ORDER_STATUS.CONFIRMED;
  
  if (req.body.paymentResult) {
    order.paymentResult = {
      id: req.body.paymentResult.id,
      status: req.body.paymentResult.status,
      update_time: req.body.paymentResult.update_time,
      email_address: req.body.paymentResult.email_address,
    };
  }

  const updatedOrder = await order.save();

  logger.info('Order marked as paid', {
    orderId: order._id,
    updatedBy: req.user._id,
    paymentMethod: order.paymentMethod,
  });

  return successResponse(res, updatedOrder, 'Order marked as paid');
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
  const { status } = req.body;
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