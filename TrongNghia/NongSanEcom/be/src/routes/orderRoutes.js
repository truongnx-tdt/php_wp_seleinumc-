import express from 'express';
import {
  addOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
} from '../controllers/orderController.js';
import { protect, isAdmin, isStaffOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / User specific
router.route('/').post(protect, addOrder);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);

// Admin & Staff routes
router.get('/all', protect, isStaffOrAdmin, getOrders);
router.put('/:id/deliver', protect, isStaffOrAdmin, updateOrderToDelivered);

export default router; 