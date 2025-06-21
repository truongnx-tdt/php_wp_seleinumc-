import paypal from '../config/paypal.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { 
  successResponse, 
  errorResponse 
} from '../utils/responseHelper.js';
import { ERROR_MESSAGES } from '../constants/index.js';
import { logger } from '../utils/logger.js';

/**
 * @desc    Create PayPal payment
 * @route   POST /api/payment/paypal
 * @access  Private
 */
export const createPaypalPayment = asyncHandler(async (req, res) => {
  const { total, orderId } = req.body;

  if (!total || total <= 0) {
    return errorResponse(res, 'Invalid payment amount', 400);
  }

  const create_payment_json = {
    intent: 'sale',
    payer: { payment_method: 'paypal' },
    redirect_urls: {
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?orderId=${orderId}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancel`,
    },
    transactions: [{
      amount: { 
        currency: 'USD', 
        total: total.toString() 
      },
      description: 'NongSanEcom Payment',
      custom: orderId || '',
    }],
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      logger.error('PayPal payment creation failed', {
        error: error.message,
        orderId,
        total,
      });
      return errorResponse(res, ERROR_MESSAGES.PAYMENT_FAILED, 500);
    } else {
      logger.info('PayPal payment created successfully', {
        paymentId: payment.id,
        orderId,
        total,
      });
      return successResponse(res, payment);
    }
  });
});

/**
 * @desc    Execute PayPal payment
 * @route   POST /api/payment/paypal/execute
 * @access  Private
 */
export const executePaypalPayment = asyncHandler(async (req, res) => {
  const { paymentId, payerId } = req.body;

  if (!paymentId || !payerId) {
    return errorResponse(res, 'Payment ID and Payer ID are required', 400);
  }

  const execute_payment_json = { payer_id: payerId };

  paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
    if (error) {
      logger.error('PayPal payment execution failed', {
        error: error.message,
        paymentId,
        payerId,
      });
      return errorResponse(res, ERROR_MESSAGES.PAYMENT_FAILED, 500);
    } else {
      logger.info('PayPal payment executed successfully', {
        paymentId,
        payerId,
        state: payment.state,
      });
      return successResponse(res, payment, 'Payment completed successfully');
    }
  });
});

/**
 * @desc    Get payment status
 * @route   GET /api/payment/status/:paymentId
 * @access  Private
 */
export const getPaymentStatus = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  if (!paymentId) {
    return errorResponse(res, 'Payment ID is required', 400);
  }

  paypal.payment.get(paymentId, (error, payment) => {
    if (error) {
      logger.error('PayPal payment status check failed', {
        error: error.message,
        paymentId,
      });
      return errorResponse(res, 'Failed to get payment status', 500);
    } else {
      return successResponse(res, {
        paymentId: payment.id,
        state: payment.state,
        intent: payment.intent,
        create_time: payment.create_time,
        update_time: payment.update_time,
      });
    }
  });
}); 