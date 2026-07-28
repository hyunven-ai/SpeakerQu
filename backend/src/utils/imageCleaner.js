import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Deletes a file from the uploads directory based on its URL path.
 * @param {string} imageUrl - The URL path of the image (e.g. '/uploads/filename.webp')
 */
export const deleteImageFile = (imageUrl) => {
  if (!imageUrl) return;
  
  try {
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
