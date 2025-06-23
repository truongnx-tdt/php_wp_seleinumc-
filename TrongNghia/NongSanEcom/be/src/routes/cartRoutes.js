import express from 'express';
const router = express.Router();
import {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

// All routes are protected
router.use(protect);

// add swagger

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get cart
 *     tags: [Cart]
 *     security:        
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           price:
 *                             type: number
 *                           quantity:
 *                             type: number     
 */
router.route('/')
  .get(getCart)
  .delete(clearCart);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 */
router.route('/items')
  .post(addItemToCart);

/**
 * @swagger
 * /api/cart/items/{productId}:
 *   put:
 *     summary: Update item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: ID of the product
 *         schema:
 *           type: string
 */
router.route('/items/:productId')
  .put(updateCartItemQuantity)
  .delete(removeItemFromCart);

export default router; 