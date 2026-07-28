import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';

// Helper to check if R2 credentials are validly set (not placeholder/empty)
const isR2Configured = () => {
  return (
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_ACCESS_KEY_ID !== 'masukkan_access_key_id_anda' &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_SECRET_ACCESS_KEY !== 'masukkan_secret_access_key_anda' &&
    process.env.R2_ENDPOINT &&
    process.env.R2_ENDPOINT !== 'https://<account_id>.r2.cloudflarestorage.com'
  );
};

let s3Client = null;

if (isR2Configured()) {
  s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  console.log('Cloudflare R2 Client initialized successfully.');
} else {
  console.log('Cloudflare R2 credentials not fully set. Falling back to local storage.');
}

/**
 * Uploads a file buffer directly to Cloudflare R2 bucket.
 * @param {Buffer} fileBuffer - The file buffer to upload.
 * @param {string} filename - The name to save the file as.
 * @param {string} mimeType - The mimetype of the file (e.g. 'image/webp').
 * @returns {Promise<string>} The public URL of the uploaded image.
 */
export const uploadToR2 = async (fileBuffer, filename, mimeType) => {
  if (!s3Client) {
    throw new Error('R2 client is not configured.');
  }

  const bucketName = process.env.R2_BUCKET_NAME || 'speaker';
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: filename,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await s3Client.send(command);
  
  const publicUrl = process.env.R2_PUBLIC_URL || '';
  // Return the public URL path
  return `${publicUrl.replace(/\/$/, '')}/${filename}`;
};

/**
 * Deletes an object from Cloudflare R2 bucket.
 * @param {string} imageUrl - The full public URL of the image.
 */
export const deleteFromR2 = async (imageUrl) => {
  if (!s3Client || !imageUrl) return;

  const publicUrl = process.env.R2_PUBLIC_URL || '';
  if (!imageUrl.includes(publicUrl) && !imageUrl.startsWith('http')) {
    // Only delete if URL belongs to our public URL or is external
    return;
  }

  try {
    const filename = path.basename(imageUrl);
    const bucketName = process.env.R2_BUCKET_NAME || 'speaker';

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: filename,
    });

    await s3Client.send(command);
    console.log(`Successfully deleted image from Cloudflare R2: ${filename}`);
  } catch (error) {
    console.error(`Failed to delete image from Cloudflare R2: ${imageUrl}`, error);
  }
};

export { isR2Configured };
