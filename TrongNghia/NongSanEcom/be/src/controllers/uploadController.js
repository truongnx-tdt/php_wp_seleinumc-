import cloudinary from '../config/cloudinary.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { 
  successResponse, 
  createdResponse,
  validationErrorResponse 
} from '../utils/responseHelper.js';
import { FILE_UPLOAD, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/index.js';
import { logger } from '../utils/logger.js';
import streamifier from 'streamifier';

/**
 * @desc    Upload image to Cloudinary
 * @route   POST /api/upload
 * @access  Private/Admin
 */
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return validationErrorResponse(res, { file: 'No file uploaded' });
  }

  // Validate file type
  if (!FILE_UPLOAD.ALLOWED_TYPES.includes(req.file.mimetype)) {
    return validationErrorResponse(res, { file: ERROR_MESSAGES.INVALID_FILE_TYPE });
  }

  // Validate file size
  if (req.file.size > FILE_UPLOAD.MAX_SIZE) {
    return validationErrorResponse(res, { file: ERROR_MESSAGES.FILE_TOO_LARGE });
  }

  const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { 
          folder: 'nongsan', 
          resource_type: 'image',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });
  };

  try {
    const result = await streamUpload(req.file.buffer);
    
    logger.info('Image uploaded successfully', {
      uploadedBy: req.user._id,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      cloudinaryId: result.public_id,
    });

    return createdResponse(res, { 
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    }, SUCCESS_MESSAGES.FILE_UPLOADED);
  } catch (error) {
    logger.error('Image upload failed', {
      error: error.message,
      uploadedBy: req.user._id,
      fileName: req.file.originalname,
    });
    throw new Error('Image upload failed');
  }
});

/**
 * @desc    Delete image from Cloudinary
 * @route   DELETE /api/upload/:publicId
 * @access  Private/Admin
 */
export const deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  if (!publicId) {
    return validationErrorResponse(res, { publicId: 'Public ID is required' });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      logger.info('Image deleted successfully', {
        deletedBy: req.user._id,
        publicId,
      });
      
      return successResponse(res, null, 'Image deleted successfully');
    } else {
      return validationErrorResponse(res, { publicId: 'Failed to delete image' });
    }
  } catch (error) {
    logger.error('Image deletion failed', {
      error: error.message,
      deletedBy: req.user._id,
      publicId,
    });
    throw new Error('Image deletion failed');
  }
});

/**
 * @desc    Upload multiple images
 * @route   POST /api/upload/multiple
 * @access  Private/Admin
 */
export const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return validationErrorResponse(res, { files: 'No files uploaded' });
  }

  // Validate number of files
  if (req.files.length > 10) {
    return validationErrorResponse(res, { files: 'Maximum 10 files allowed' });
  }

  const uploadPromises = req.files.map(async (file) => {
    // Validate file type
    if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.mimetype)) {
      throw new Error(`Invalid file type: ${file.originalname}`);
    }

    // Validate file size
    if (file.size > FILE_UPLOAD.MAX_SIZE) {
      throw new Error(`File too large: ${file.originalname}`);
    }

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { 
            folder: 'nongsan', 
            resource_type: 'image',
            transformation: [
              { width: 800, height: 600, crop: 'limit' },
              { quality: 'auto' }
            ]
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    return await streamUpload(file.buffer);
  });

  try {
    const results = await Promise.all(uploadPromises);
    
    const uploadedImages = results.map(result => ({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    }));

    logger.info('Multiple images uploaded successfully', {
      uploadedBy: req.user._id,
      count: req.files.length,
    });

    return createdResponse(res, { images: uploadedImages }, 'Images uploaded successfully');
  } catch (error) {
    logger.error('Multiple images upload failed', {
      error: error.message,
      uploadedBy: req.user._id,
    });
    throw new Error('Images upload failed');
  }
});
