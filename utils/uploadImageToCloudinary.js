// utils/uploadImageToCloudinary.js
const cloudinary = require('../cloudinary');

/**
 * Uploads a local image path or base64 string to Cloudinary
 * @param {string} image - Path to image file or base64 string (data:image/...)
 * @param {string} folder - Optional folder name in Cloudinary
 * @returns {Promise<string>} - URL of the uploaded image
 */
async function uploadImageToCloudinary(image, folder = 'products') {
  try {
    const result = await cloudinary.uploader.upload(image, {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 800, crop: 'scale' }],
    });
    return result.secure_url;
  } catch (err) {
    console.error('Cloudinary upload failed:', err);
    throw new Error('Image upload failed');
  }
}

module.exports = uploadImageToCloudinary;
