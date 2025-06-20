import paypal from '../config/paypal.js';
import asyncHandler from 'express-async-handler';

// @desc    Create PayPal payment
// @route   POST /api/payment/paypal
// @access  Private
export const createPaypalPayment = asyncHandler(async (req, res) => {
  const { total } = req.body;
  const create_payment_json = {
    intent: 'sale',
    payer: { payment_method: 'paypal' },
    redirect_urls: {
      return_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    },
    transactions: [{
      amount: { currency: 'USD', total: total.toString() },
      description: 'NongSanEcom Payment',
    }],
  };
  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      res.status(500);
      throw new Error('PayPal payment creation failed');
    } else {
      res.json(payment);
    }
  });
});

// @desc    Execute PayPal payment
// @route   POST /api/payment/paypal/execute
// @access  Private
export const executePaypalPayment = asyncHandler(async (req, res) => {
  const { paymentId, payerId } = req.body;
  const execute_payment_json = { payer_id: payerId };
  paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
    if (error) {
      res.status(500);
      throw new Error('PayPal payment execution failed');
    } else {
      res.json(payment);
    }
  });
}); 