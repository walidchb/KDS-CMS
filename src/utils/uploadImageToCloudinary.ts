import cloudinary from '@/lib/cloudinary';

/**
 * Uploads a local image buffer or base64 string to Cloudinary
 * @param image - Buffer or base64 image string
 * @param folder - Cloudinary folder
 * @returns URL of the uploaded image
 */
export default async function uploadImageToCloudinary(
  image: string | Buffer,
  folder: string = 'products'
): Promise<string> {
  try {
    let imageToUpload: string;

    if (typeof image === 'string') {
      imageToUpload = image;
    } else {
      const base64 = image.toString('base64');
      imageToUpload = `data:image/jpeg;base64,${base64}`;
    }

    const result = await cloudinary.uploader.upload(imageToUpload, {
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
