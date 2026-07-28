import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { deleteFromR2 } from './r2.js';

/**
 * Deletes a file from the uploads directory or Cloudflare R2 based on its URL path.
 * @param {string} imageUrl - The URL path of the image (e.g. '/uploads/filename.webp' or R2 URL)
 */
export const deleteImageFile = (imageUrl) => {
  if (!imageUrl) return;
  
  try {
    const publicUrl = process.env.R2_PUBLIC_URL || '';
    if (imageUrl.includes(publicUrl) || imageUrl.startsWith('http')) {
      // Delete from Cloudflare R2 (fire and forget)
      deleteFromR2(imageUrl).catch(error => {
        console.error(`Failed asynchronously to delete R2 image: ${imageUrl}`, error);
      });
      return;
    }

    // Extract filename from URL (e.g. /uploads/image.webp -> image.webp)
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, '../../uploads', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted image file: ${filePath}`);
    } else {
      console.log(`Image file not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`Failed to delete image file: ${imageUrl}`, error);
  }
};
