import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getDashboardStats,
} from '../controllers/productController.js';
import { protect, isAdmin, isStaffOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.route('/').get(getProducts);
router.route('/:id').get(getProductById);
router.route('/:id/reviews').post(protect, createProductReview);

// Admin & Staff routes
router.post('/create', protect, isStaffOrAdmin, createProduct);
router.put('/:id/update', protect, isStaffOrAdmin, updateProduct);
router.delete('/:id/delete', protect, isStaffOrAdmin, deleteProduct);

// Admin only routes
router.get('/dashboard-stats', protect, isAdmin, getDashboardStats);

export default router; 