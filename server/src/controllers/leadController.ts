import { Response } from 'express';
import Lead from '../models/Lead';
import { AuthRequest, LeadStatus, LeadSource, SortOrder } from '../types';

const buildFilter = (query: AuthRequest['query'], userRole: string, userId: string) => {
  const filter: Record<string, unknown> = {};

  if (userRole === 'sales') filter.createdBy = userId;
  if (query.status) filter.status = query.status as LeadStatus;
  if (query.source) filter.source = query.source as LeadSource;
  if (query.search) {
    const regex = new RegExp(query.search as string, 'i');
    filter.$or = [{ name: regex }, { email: regex }];
  }
  return filter;
};

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sort = 'latest', page = '1', limit = '10' } = req.query;
   const pageNum = Math.max(1, parseInt(String(page), 10));
const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10)));
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = (sort as SortOrder) === 'oldest' ? 1 : -1;

    const filter = buildFilter(req.query, req.user!.role, req.user!.id);

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    res.json({
      success: true,
      data: leads,
      meta: { total, page: pageNum, limit: limitNum, totalPages, hasNext: pageNum < totalPages, hasPrev: pageNum > 1 },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch leads' });
  }
};

export const getLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
    if (!lead) { res.status(404).json({ success: false, message: 'Lead not found' }); return; }
    if (req.user!.role === 'sales' && lead.createdBy._id.toString() !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Access denied' }); return;
    }
    res.json({ success: true, data: lead });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch lead' });
  }
};

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.create({ ...req.body, createdBy: req.user!.id });
    res.status(201).json({ success: true, data: lead, message: 'Lead created successfully' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create lead' });
  }
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) { res.status(404).json({ success: false, message: 'Lead not found' }); return; }
    if (req.user!.role === 'sales' && lead.createdBy.toString() !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Access denied' }); return;
    }
    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updated, message: 'Lead updated successfully' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update lead' });
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) { res.status(404).json({ success: false, message: 'Lead not found' }); return; }
    if (req.user!.role === 'sales' && lead.createdBy.toString() !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Access denied' }); return;
    }
    await lead.deleteOne();
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete lead' });
  }
};

export const exportLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter = buildFilter(req.query, req.user!.role, req.user!.id);
    const leads = await Lead.find(filter).populate('createdBy', 'name').sort({ createdAt: -1 });

    const headers = ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created At'];
    const rows = leads.map((l) => [
      l.name, l.email, l.status, l.source,
      (l.notes || '').replace(/,/g, ';'),
      new Date(l.createdAt).toISOString(),
    ]);

    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.send(csv);
  } catch {
    res.status(500).json({ success: false, message: 'Failed to export leads' });
  }
};
