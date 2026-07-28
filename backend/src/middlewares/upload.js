import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer memory storage
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter
});

import { isR2Configured, uploadToR2 } from '../utils/r2.js';

// Middleware to process uploaded images with sharp (convert to WebP & resize) and upload to R2/Local
export const processImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  const useR2 = isR2Configured();
  const uploadDir = path.join(__dirname, '../../uploads');
  if (!useR2 && !fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  req.processedImages = [];

  try {
    const processPromises = req.files.map(async (file, index) => {
      const filename = `img-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;

      // Convert to webp, resize to max 1200px (width or height), quality 80%
      const webpBuffer = await sharp(file.buffer)
        .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
        .toFormat('webp')
        .webp({ quality: 80 })
        .toBuffer();

      let imageUrl = '';
      if (useR2) {
        // Upload directly to Cloudflare R2
        imageUrl = await uploadToR2(webpBuffer, filename, 'image/webp');
      } else {
        // Fallback to local file storage
        const filePath = path.join(uploadDir, filename);
        await fs.promises.writeFile(filePath, webpBuffer);
        imageUrl = `/uploads/${filename}`;
      }

      req.processedImages.push({
        url: imageUrl,
        originalname: file.originalname,
        index
      });
    });

    await Promise.all(processPromises);
    next();
  } catch (error) {
    console.error('Error processing or uploading image:', error);
    return res.status(500).json({ message: 'Gagal memproses/mengunggah gambar.', error: error.message });
  }
};
