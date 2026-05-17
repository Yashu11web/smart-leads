import React, { useState } from 'react';
import { Pencil, Trash2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { StatusBadge, SourceBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { LeadForm } from './LeadForm';
import { useLeadsStore } from '../../store/leadsStore';
import { useAuthStore } from '../../store/authStore';
import { Lead, LeadFormData } from '../../types';

export const LeadsTable: React.FC = () => {
  const { leads, meta, filters, setFilters, updateLead, deleteLead, isLoading } = useLeadsStore();
  const { user } = useAuthStore();
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleUpdate = async (data: LeadFormData) => {
    if (!editLead) return;
    setSubmitting(true);
    await updateLead(editLead._id, data);
    setSubmitting(false);
    setEditLead(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteLead(deleteId);
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading leads...</p>
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Eye size={20} className="text-gray-400" />
        </div>
        <p className="text-gray-900 dark:text-white font-medium">No leads found</p>
        <p className="text-sm text-gray-500">Try adjusting your filters or create a new lead.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{lead.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{lead.email}</td>
                  <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                  <td className="px-4 py-3"><SourceBadge source={lead.source} /></td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewLead(lead)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors" title="View">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => setEditLead(lead)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 transition-colors" title="Edit">
                        <Pencil size={14} />
                      </button>
                      {user?.role === 'admin' && (
                        <button onClick={() => setDeleteId(lead._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" disabled={!meta.hasPrev} onClick={() => setFilters({ page: meta.page - 1 })}>
                <ChevronLeft size={14} />
              </Button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{meta.page} / {meta.totalPages}</span>
              <Button variant="secondary" size="sm" disabled={!meta.hasNext} onClick={() => setFilters({ page: meta.page + 1 })}>
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead">
        {editLead && <LeadForm initialData={editLead} onSubmit={handleUpdate} onCancel={() => setEditLead(null)} isLoading={submitting} />}
      </Modal>

      {/* View Modal */}
      <Modal isOpen={!!viewLead} onClose={() => setViewLead(null)} title="Lead Details">
        {viewLead && (
          <div className="space-y-4">
            {[
              ['Name', viewLead.name],
              ['Email', viewLead.email],
              ['Status', viewLead.status],
              ['Source', viewLead.source],
              ['Notes', viewLead.notes ?? 'None'],
              ['Created', new Date(viewLead.createdAt).toLocaleDateString()],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-500">{k}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{v}</span>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setViewLead(null)} className="w-full mt-4">Close</Button>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Lead">
        <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure? This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleDelete} className="flex-1">Delete</Button>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
        </div>
      </Modal>
    </>
  );
};
