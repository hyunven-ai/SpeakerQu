import express from 'express';
import {
  getPublicSlides,
  getAdminSlides,
  createSlide,
  updateSlide,
  deleteSlide,
  reorderSlides
} from '../controllers/slideController.js';
import { verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getPublicSlides);
router.get('/admin', verifyAdmin, getAdminSlides);
router.post('/', verifyAdmin, createSlide);
router.put('/reorder', verifyAdmin, reorderSlides);
router.put('/:id', verifyAdmin, updateSlide);
router.delete('/:id', verifyAdmin, deleteSlide);

export default router;
