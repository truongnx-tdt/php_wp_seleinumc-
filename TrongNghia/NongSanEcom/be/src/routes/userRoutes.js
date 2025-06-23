import express from 'express';
const router = express.Router();
import { protect, requireAdmin } from '../middleware/authMiddleware.js';
import {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    addUserAddress,
    getUserAddresses,
    updateUserAddress,
    deleteUserAddress,
    setDefaultAddress,
} from '../controllers/userController.js';

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management (Admin) and address management
 */

// === USER ADDRESS ROUTES (for logged-in user) ===

/**
 * @swagger
 * /api/users/profile/addresses:
 *   get:
 *     summary: Get all addresses for the logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of addresses
 *   post:
 *     summary: Add a new address for the logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Address created successfully
 */
router.route('/profile/addresses')
    .post(protect, addUserAddress)
    .get(protect, getUserAddresses);

/**
 * @swagger
 * /api/users/profile/addresses/{addressId}:
 *   put:
 *     summary: Update an address for the logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Address updated
 *   delete:
 *     summary: Delete an address for the logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted
 */
router.route('/profile/addresses/:addressId')
    .put(protect, updateUserAddress)
    .delete(protect, deleteUserAddress);

/**
 * @swagger
 * /api/users/profile/addresses/{addressId}/default:
 *   put:
 *     summary: Set an address as default for the logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Default address set
 */
router.put('/profile/addresses/:addressId/default', protect, setDefaultAddress);


// === ADMIN ROUTES ===

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 */
router.route('/')
    .get(protect, requireAdmin, getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data
 *   put:
 *     summary: Update user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *   delete:
 *     summary: Delete user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.route('/:id')
    .get(protect, requireAdmin, getUserById)
    .put(protect, requireAdmin, updateUser)
    .delete(protect, requireAdmin, deleteUser);

export default router; 