import express from 'express';
import {
  getBanners,
  getPublicBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
  updateBannerPriority
} from '../controllers/bannerController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/public', getPublicBanners);
router.get('/:id', getBannerById);

// Protected routes (admin only)
router.route('/')
  .get(protect, requireAdmin, getBanners)
  .post(protect, requireAdmin, createBanner);

router.route('/:id')
  .put(protect, requireAdmin, updateBanner)
  .delete(protect, requireAdmin, deleteBanner);

router.patch('/:id/toggle', protect, requireAdmin, toggleBannerStatus);
router.patch('/:id/priority', protect, requireAdmin, updateBannerPriority);

export default router; 