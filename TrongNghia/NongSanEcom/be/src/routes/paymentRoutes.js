import express from 'express';
import { createPaypalPayment, executePaypalPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/paypal', protect, createPaypalPayment);
router.post('/paypal/execute', protect, executePaypalPayment);

export default router; 