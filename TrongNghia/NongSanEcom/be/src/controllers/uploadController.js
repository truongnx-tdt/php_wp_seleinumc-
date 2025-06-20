import cloudinary from '../config/cloudinary.js';
import asyncHandler from 'express-async-handler';

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }
  const result = await cloudinary.uploader.upload_stream({
    folder: 'nongsan',
    resource_type: 'image',
  }, (error, result) => {
    if (error) {
      res.status(500);
      throw new Error('Cloudinary upload failed');
    }
    res.status(201).json({ url: result.secure_url });
  });
  req.file.stream.pipe(result);
}); 