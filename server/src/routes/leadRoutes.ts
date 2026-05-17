import { Router } from 'express';
import { body } from 'express-validator';
import { getLeads, getLead, createLead, updateLead, deleteLead, exportLeads } from '../controllers/leadController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.use(protect);

const leadValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status'),
  body('source').isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),
];

router.get('/', getLeads);
router.get('/export', exportLeads);
router.get('/:id', getLead);
router.post('/', leadValidation, validate, createLead);
router.put('/:id', leadValidation, validate, updateLead);
router.delete('/:id', authorize('admin'), deleteLead);

export default router;
