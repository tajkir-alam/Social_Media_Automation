const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authMiddleware } = require('../middleware/auth');
const imageController = require('../controllers/imageController');

/**
 * Image Routes
 */

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 5242880, // 5MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// All routes require authentication
router.post('/', authMiddleware, upload.single('image'), imageController.uploadImage.bind(imageController));
router.get('/', authMiddleware, imageController.getImages.bind(imageController));
router.get('/:filename/metadata', authMiddleware, imageController.getImageMetadata.bind(imageController));
router.delete('/:filename', authMiddleware, imageController.deleteImage.bind(imageController));
router.get('/:filename/resize', authMiddleware, imageController.resizeImage.bind(imageController));

module.exports = router;
