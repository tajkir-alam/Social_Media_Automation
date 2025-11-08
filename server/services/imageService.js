const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/**
 * Image Service
 * Handles image selection, processing, and matching with captions
 */

class ImageService {
  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
    this.imagesDir = path.join(this.uploadDir, 'images');
  }

  /**
   * Get all available images
   * @returns {Promise<Array>} Array of image file paths
   */
  async getAvailableImages() {
    try {
      if (!fs.existsSync(this.imagesDir)) {
        fs.mkdirSync(this.imagesDir, { recursive: true });
        return [];
      }

      const files = fs.readdirSync(this.imagesDir);
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

      const images = files
        .filter((file) => imageExtensions.includes(path.extname(file).toLowerCase()))
        .map((file) => ({
          filename: file,
          path: path.join(this.imagesDir, file),
          url: `/uploads/images/${file}`,
        }));

      return images;
    } catch (error) {
      console.error('Error getting available images:', error.message);
      return [];
    }
  }

  /**
   * Select best image for a caption
   * Uses simple heuristics to match image with caption content
   * @param {String} caption - Caption text
   * @param {Array} keywords - Keywords from caption
   * @returns {Promise<Object>} Selected image
   */
  async selectImageForCaption(caption, keywords = []) {
    try {
      const availableImages = await this.getAvailableImages();

      if (availableImages.length === 0) {
        return null;
      }

      // Simple selection: use first available image
      // In production, this could use image recognition APIs
      // to match images with caption content
      const selectedImage = availableImages[0];

      return {
        filename: selectedImage.filename,
        path: selectedImage.path,
        url: selectedImage.url,
      };
    } catch (error) {
      console.error('Error selecting image:', error.message);
      return null;
    }
  }

  /**
   * Upload image to server
   * @param {Object} file - File object from multer
   * @returns {Promise<Object>} Upload result
   */
  async uploadImage(file) {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      // Ensure upload directory exists
      if (!fs.existsSync(this.imagesDir)) {
        fs.mkdirSync(this.imagesDir, { recursive: true });
      }

      const filename = `${Date.now()}_${file.originalname}`;
      const filepath = path.join(this.imagesDir, filename);

      // Save file
      fs.writeFileSync(filepath, file.buffer);

      // Optimize image with sharp
      await sharp(filepath).resize(1200, 1200, { fit: 'inside', withoutEnlargement: true }).toFile(filepath);

      return {
        success: true,
        filename,
        path: filepath,
        url: `/uploads/images/${filename}`,
        size: file.size,
      };
    } catch (error) {
      console.error('Error uploading image:', error.message);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Delete image
   * @param {String} filename - Image filename
   * @returns {Promise<Boolean>} Success status
   */
  async deleteImage(filename) {
    try {
      const filepath = path.join(this.imagesDir, filename);

      if (!fs.existsSync(filepath)) {
        throw new Error('Image not found');
      }

      fs.unlinkSync(filepath);
      return true;
    } catch (error) {
      console.error('Error deleting image:', error.message);
      return false;
    }
  }

  /**
   * Get image metadata
   * @param {String} filename - Image filename
   * @returns {Promise<Object>} Image metadata
   */
  async getImageMetadata(filename) {
    try {
      const filepath = path.join(this.imagesDir, filename);

      if (!fs.existsSync(filepath)) {
        throw new Error('Image not found');
      }

      const metadata = await sharp(filepath).metadata();

      return {
        filename,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: fs.statSync(filepath).size,
      };
    } catch (error) {
      console.error('Error getting image metadata:', error.message);
      return null;
    }
  }

  /**
   * Resize image
   * @param {String} filename - Image filename
   * @param {Number} width - Target width
   * @param {Number} height - Target height
   * @returns {Promise<Buffer>} Resized image buffer
   */
  async resizeImage(filename, width, height) {
    try {
      const filepath = path.join(this.imagesDir, filename);

      if (!fs.existsSync(filepath)) {
        throw new Error('Image not found');
      }

      const resized = await sharp(filepath)
        .resize(width, height, { fit: 'cover', withoutEnlargement: true })
        .toBuffer();

      return resized;
    } catch (error) {
      console.error('Error resizing image:', error.message);
      throw error;
    }
  }
}

module.exports = new ImageService();
