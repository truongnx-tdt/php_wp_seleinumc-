import express from 'express';
import { 
  createPaypalPayment, 
  executePaypalPayment,
  getPaymentStatus 
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/paypal', protect, createPaypalPayment);
router.post('/paypal/execute', protect, executePaypalPayment);
router.get('/status/:paymentId', protect, getPaymentStatus);

export default router; 