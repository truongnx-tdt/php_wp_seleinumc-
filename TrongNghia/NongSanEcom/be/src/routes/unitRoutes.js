import express from 'express';
const router = express.Router();
import {
    createUnit,
    getUnits,
    getUnitById,
    updateUnit,
    deleteUnit,
} from '../controllers/unitController.js';
import { protect, requireStaffOrAdmin } from '../middleware/authMiddleware.js';

// add swagger
/**
 * @swagger
 * tags:
 *   name: Unit
 *   description: Unit management
 */

/**
 * @swagger
 * /api/units:
 *   get:
 *     summary: Get all units
 *     tags: [Unit]
 *     responses:
 *       200:
 *         description: Units retrieved successfully
 *   post:
 *      summary: Create a new unit
 *      tags: [Unit]
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
 *                  symbol:
 *                      type: string
 *                  description:
 *                      type: string
 *      responses:
 *          201:
 *              description: Unit created successfully
 *
 */
router.route('/')
    .post(protect, requireStaffOrAdmin, createUnit)
    .get(getUnits);

/**
 * @swagger
 * /api/units/{id}:
 *   get:
 *     summary: Get unit by ID
 *     tags: [Unit]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the unit
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unit retrieved successfully
 *   put:
 *     summary: Update a unit
 *     tags: [Unit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the unit
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
 *               symbol:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Unit updated successfully
 *   delete:
 *      summary: Delete a unit
 *      tags: [Unit]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: ID of the unit
 *          schema:
 *            type: string
 *      responses:
 *          200:
 *              description: Unit deleted successfully
 */
router.route('/:id')
    .get(getUnitById)
    .put(protect, requireStaffOrAdmin, updateUnit)
    .delete(protect, requireStaffOrAdmin, deleteUnit);

export default router; 