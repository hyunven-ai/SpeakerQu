import express from 'express';
import rateLimit from 'express-rate-limit';
import { upload, processImages } from '../middlewares/upload.js';
import { verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Rate limiter for upload endpoint to prevent spamming server disk space
const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // Limit each IP to 50 uploads per window
  message: { message: 'Terlalu banyak request upload. Silakan coba lagi nanti.' }
});

router.post('/', verifyAdmin, uploadLimiter, upload.array('images', 10), processImages, (req, res) => {
  if (!req.processedImages || req.processedImages.length === 0) {
    return res.status(400).json({ message: 'Tidak ada file gambar yang berhasil di-upload.' });
  }
  return res.status(200).json({
    message: 'Gambar berhasil di-upload dan di-optimalkan.',
    images: req.processedImages
  });
});

export default router;
