import React, { useState } from 'react';
import { Lead } from '../../types';
import { StatusBadge, SourceBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { LeadForm } from './LeadForm';
import { useLeadsStore } from '../../store/leadsStore';
import { useAuthStore } from '../../store/authStore';
import { LeadFormData } from '../../types';

interface Props { leads: Lead[] }

export const LeadTable: React.FC<Props> = ({ leads }) => {
  const { updateLead, deleteLead } = useLeadsStore();
  const { user } = useAuthStore();
  const [editing, setEditing] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState<Lead | null>(null);

  const handleUpdate = async (data: LeadFormData) => {
    if (!editing) return;
    await updateLead(editing._id, data);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await deleteLead(deleting._id);
    setDeleting(null);
  };

  if (leads.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-16 text-center">
        <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <p className="text-gray-500 dark:text-gray-400 font-medium">No leads found</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filters or create a new lead</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{lead.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{lead.email}</td>
                  <td className="px-4 py-3"><StatusBadge status={lead.status}/></td>
                  <td className="px-4 py-3"><SourceBadge source={lead.source}/></td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditing(lead)}>Edit</Button>
                      {user?.role === 'admin' && (
                        <Button variant="ghost" size="sm" onClick={() => setDeleting(lead)}
                          className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Lead">
        {editing && <LeadForm lead={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)}/>}
      </Modal>

      <Modal isOpen={!!deleting} onClose={() => setDeleting(null)} title="Delete Lead">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete <strong>{deleting?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleDelete} className="flex-1">Delete</Button>
            <Button variant="secondary" onClick={() => setDeleting(null)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
