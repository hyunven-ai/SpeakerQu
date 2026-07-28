import express from 'express';
import rateLimit from 'express-rate-limit';
import { login } from '../controllers/authController.js';

const router = express.Router();

// Rate limiter for login endpoint to prevent brute-force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per window
  message: { message: 'Terlalu banyak percobaan login dari IP ini. Silakan coba lagi setelah 15 menit.' }
});

router.post('/login', loginLimiter, login);

export default router;
