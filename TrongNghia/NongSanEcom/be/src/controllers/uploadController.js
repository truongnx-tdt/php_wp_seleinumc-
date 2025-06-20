import cloudinary from '../config/cloudinary.js';
import asyncHandler from 'express-async-handler';
import streamifier from 'streamifier';

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'nongsan', resource_type: 'image' },
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

  const result = await streamUpload(req.file.buffer);
  res.status(201).json({ url: result.secure_url });
});
