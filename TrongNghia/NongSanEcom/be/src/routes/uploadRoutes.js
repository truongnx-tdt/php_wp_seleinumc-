import express from 'express';
import multer from 'multer';
import { 
  uploadImage, 
  deleteImage, 
  uploadMultipleImages 
} from '../controllers/uploadController.js';
import { requireStaffOrAdmin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10, // Max 10 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Image upload endpoints
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload an image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
// Routes
router.post('/', protect, requireStaffOrAdmin, upload.single('image'), uploadImage);
router.post('/multiple', protect, requireStaffOrAdmin, upload.array('images', 10), uploadMultipleImages);
router.delete('/:publicId', protect, requireStaffOrAdmin, deleteImage);

export default router; 