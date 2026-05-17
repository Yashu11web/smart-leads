import { Router } from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
} from '../controllers/leadsController';
import { protect } from '../middleware/auth';
import { leadValidation, validate } from '../middleware/validate';

const router = Router();

router.use(protect);

router.get('/', getLeads);
router.get('/export', exportLeads);
router.get('/:id', getLead);
router.post('/', leadValidation, validate, createLead);
router.put('/:id', leadValidation, validate, updateLead);
router.delete('/:id', deleteLead);

export default router;
