import cloudinary from '@/lib/cloudinary';

/**
 * Uploads a local image buffer or base64 string to Cloudinary
 * @param image - Buffer or base64 image string
 * @param folder - Cloudinary folder
 * @returns URL of the uploaded image
 */
export async function uploadImageToCloudinary(
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


/**
 * Uploads a PDF or DOC/DOCX file to Cloudinary
 * @param file - Buffer, base64 string, or file path
 * @param folder - Cloudinary folder
 * @returns URL of the uploaded file
 */

export async function uploadDocumentToCloudinary(
  file: string | Buffer,
  folder: string = 'documents'
): Promise<string> {
  try {
    let fileToUpload: string;

    if (typeof file === 'string') {
      fileToUpload = file; // file path or base64 string
    } else {
      const base64 = file.toString('base64');
      fileToUpload = `data:application/octet-stream;base64,${base64}`;
    }

    const result = await cloudinary.uploader.upload(fileToUpload, {
      folder,
      resource_type: 'raw', // <-- important for non-image files
      allowed_formats: ['pdf', 'doc', 'docx'],
    });

    return result.secure_url;
  } catch (err) {
    console.error('Cloudinary document upload failed:', err);
    throw new Error('Document upload failed');
  }
}
