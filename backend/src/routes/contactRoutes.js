import express from 'express';
import {
  getPublicContacts,
  getAdminContacts,
  createContact,
  updateContact,
  deleteContact,
  reorderContacts
} from '../controllers/contactController.js';
import { verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getPublicContacts);
router.get('/admin', verifyAdmin, getAdminContacts);
router.post('/', verifyAdmin, createContact);
router.put('/reorder', verifyAdmin, reorderContacts);
router.put('/:id', verifyAdmin, updateContact);
router.delete('/:id', verifyAdmin, deleteContact);

export default router;
