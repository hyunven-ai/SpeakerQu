import express from 'express';
import { trackWhatsappClick, getDashboardStats } from '../controllers/analyticsController.js';
import { verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.post('/whatsapp-click', trackWhatsappClick);
router.get('/dashboard-stats', verifyAdmin, getDashboardStats);

export default router;
