import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/uploadController.js';
import { isStaffOrAdmin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post('/', protect, isStaffOrAdmin , upload.single('image'), uploadImage);

export default router; 