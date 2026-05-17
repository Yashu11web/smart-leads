import { Response } from 'express';
import Lead from '../models/Lead';
import { AuthRequest, LeadStatus, LeadSource, SortOrder } from '../types';

const buildFilter = (
  query: AuthRequest['query'],
  userRole: string,
  userId: string
) => {
  const filter: Record<string, unknown> = {};

  if (userRole === 'sales') {
    filter.createdBy = userId;
  }

  if (query.status) {
    filter.status = query.status as LeadStatus;
  }

  if (query.source) {
    filter.source = query.source as LeadSource;
  }

  if (query.search) {
    const regex = new RegExp(query.search as string, 'i');

    filter.$or = [
      { name: regex },
      { email: regex },
    ];
  }

  return filter;
};

export const getLeads = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      sort = 'latest',
      page = '1',
      limit = '10',
    } = req.query;

    const pageNum = Math.max(
      1,
      parseInt(String(page), 10)
    );

    const limitNum = Math.min(
      100,
      Math.max(1, parseInt(String(limit), 10))
    );

    const skip = (pageNum - 1) * limitNum;

    const sortOrder =
      (sort as SortOrder) === 'oldest' ? 1 : -1;

    const filter = buildFilter(
      req.query,
      req.user!.role,
      req.user!.id
    );

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
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leads',
    });
  }
};

export const getLead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found',
      });

      return;
    }

    res.json({
      success: true,
      data: lead,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lead',
    });
  }
};