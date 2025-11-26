import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Only configure if credentials are provided
if (process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET &&
    !process.env.CLOUDINARY_CLOUD_NAME.includes('your_cloud_name')) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✅ Cloudinary configured');
} else {
  console.log('⚠️  Cloudinary not configured - using local storage');
}

// Use memory storage - we'll upload to Cloudinary manually in the route
const storage = multer.memoryStorage();

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'));
    }
  }
});

export const uploadToCloudinary = async (buffer, options = {}) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || 
      process.env.CLOUDINARY_CLOUD_NAME.includes('your_cloud_name')) {
    // Return mock URL for development
    return {
      url: `https://via.placeholder.com/800x400?text=Event+Image`,
      public_id: `mock_${Date.now()}`
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'event-booking',
        ...options
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
};

export const deleteImage = async (publicId) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || 
      process.env.CLOUDINARY_CLOUD_NAME.includes('your_cloud_name')) {
    console.log('Cloudinary not configured, skipping image deletion');
    return;
  }
  
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

export default cloudinary;
