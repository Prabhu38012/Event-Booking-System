import express from 'express';
import { upload, uploadToCloudinary } from '../config/cloudinary.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// @desc    Upload event images
// @route   POST /api/upload/event-images
// @access  Private (Organizer/Admin)
router.post(
  '/event-images',
  protect,
  authorize('organizer', 'admin'),
  upload.array('images', 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const uploadPromises = req.files.map(file => 
        uploadToCloudinary(file.buffer, { folder: 'event-booking/events' })
      );

      const results = await Promise.all(uploadPromises);

      res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: error.message });
    }
  }
);

// @desc    Upload user avatar
// @route   POST /api/upload/avatar
// @access  Private
router.post(
  '/avatar',
  protect,
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const result = await uploadToCloudinary(req.file.buffer, { 
        folder: 'event-booking/avatars',
        transformation: [{ width: 200, height: 200, crop: 'fill' }]
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
