import express from 'express';

import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
} from '../controllers/leadController';

import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getLeads);

router.get('/export', protect, exportLeads);

router.get('/:id', protect, getLead);

router.post('/', protect, createLead);

router.put('/:id', protect, updateLead);

router.delete('/:id', protect, deleteLead);

export default router;