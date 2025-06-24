import express from 'express';
const router = express.Router();
import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from '../controllers/categoryController.js';
import { protect, requireStaffOrAdmin } from '../middleware/authMiddleware.js';

// add swagger
/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *   post:
 *      summary: Create a new category
 *      tags: [Category]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  description:
 *                      type: string
 *      responses:
 *          201:
 *              description: Category created successfully
 *
 */
router.route('/')
    .post(protect, requireStaffOrAdmin, createCategory)
    .get(getCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Category]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *   put:
 *     summary: Update a category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the category
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *   delete:
 *      summary: Delete a category
 *      tags: [Category]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: ID of the category
 *          schema:
 *            type: string
 *      responses:
 *          200:
 *              description: Category deleted successfully
 */
router.route('/:id')
    .get(getCategoryById)
    .put(protect, requireStaffOrAdmin, updateCategory)
    .delete(protect, requireStaffOrAdmin, deleteCategory);

export default router;

