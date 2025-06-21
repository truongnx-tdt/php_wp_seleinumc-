import express from 'express';
import {
  addOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  getOrderStats,
} from '../controllers/orderController.js';
import { protect, requireAdmin, requireStaffOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.route('/').post(protect, addOrder);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);

// Admin & Staff routes
router.get('/', protect, requireStaffOrAdmin, getOrders);
router.put('/:id/deliver', protect, requireStaffOrAdmin, updateOrderToDelivered);
router.put('/:id/status', protect, requireStaffOrAdmin, updateOrderStatus);

// Admin only routes
router.get('/stats', protect, requireAdmin, getOrderStats);

export default router; 