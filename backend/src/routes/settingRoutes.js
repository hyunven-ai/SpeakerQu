import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingController.js';
import { verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', verifyAdmin, updateSettings);

export default router;
