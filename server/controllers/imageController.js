const imageService = require('../services/imageService');

/**
 * Image Controller
 * Handles image upload and management
 */

class ImageController {
  /**
   * Upload image
   */
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file provided' });
      }

      const result = await imageService.uploadImage(req.file);

      return res.status(201).json({
        success: true,
        image: result,
        message: 'Image uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading image:', error.message);
      return res.status(500).json({ message: 'Failed to upload image', error: error.message });
    }
  }

  /**
   * Get all available images
   */
  async getImages(req, res) {
    try {
      const images = await imageService.getAvailableImages();

      return res.json({
        success: true,
        images,
        total: images.length,
      });
    } catch (error) {
      console.error('Error fetching images:', error.message);
      return res.status(500).json({ message: 'Failed to fetch images', error: error.message });
    }
  }

  /**
   * Get image metadata
   */
  async getImageMetadata(req, res) {
    try {
      const { filename } = req.params;

      const metadata = await imageService.getImageMetadata(filename);

      if (!metadata) {
        return res.status(404).json({ message: 'Image not found' });
      }

      return res.json({
        success: true,
        metadata,
      });
    } catch (error) {
      console.error('Error fetching image metadata:', error.message);
      return res.status(500).json({ message: 'Failed to fetch metadata', error: error.message });
    }
  }

  /**
   * Delete image
   */
  async deleteImage(req, res) {
    try {
      const { filename } = req.params;

      const success = await imageService.deleteImage(filename);

      if (!success) {
        return res.status(404).json({ message: 'Image not found' });
      }

      return res.json({
        success: true,
        message: 'Image deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting image:', error.message);
      return res.status(500).json({ message: 'Failed to delete image', error: error.message });
    }
  }

  /**
   * Resize image
   */
  async resizeImage(req, res) {
    try {
      const { filename } = req.params;
      const { width, height } = req.query;

      if (!width || !height) {
        return res.status(400).json({ message: 'Width and height are required' });
      }

      const resized = await imageService.resizeImage(
        filename,
        parseInt(width),
        parseInt(height)
      );

      res.setHeader('Content-Type', 'image/jpeg');
      return res.send(resized);
    } catch (error) {
      console.error('Error resizing image:', error.message);
      return res.status(500).json({ message: 'Failed to resize image', error: error.message });
    }
  }
}

module.exports = new ImageController();
