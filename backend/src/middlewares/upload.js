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

// Middleware to process uploaded images with sharp (convert to WebP & resize)
export const processImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  const uploadDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  req.processedImages = [];

  try {
    const processPromises = req.files.map(async (file, index) => {
      const filename = `img-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
      const filePath = path.join(uploadDir, filename);

      // Convert to webp, resize to max 1200px (width or height), quality 80%
      await sharp(file.buffer)
        .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
        .toFormat('webp')
        .webp({ quality: 80 })
        .toFile(filePath);

      req.processedImages.push({
        url: `/uploads/${filename}`,
        originalname: file.originalname,
        index
      });
    });

    await Promise.all(processPromises);
    next();
  } catch (error) {
    console.error('Error processing image with sharp:', error);
    return res.status(500).json({ message: 'Gagal memproses gambar.', error: error.message });
  }
};
