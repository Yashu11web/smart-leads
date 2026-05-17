import React, { useEffect, useState } from 'react';
import { useLeadsStore } from '../store/leadsStore';
import { useAuthStore } from '../store/authStore';
import { Navbar } from '../components/layout/Navbar';
import { LeadFilters } from '../components/leads/LeadFilters';
import { LeadTable } from '../components/leads/LeadTable';
import { Pagination } from '../components/leads/Pagination';
import { StatsBar } from '../components/leads/StatsBar';
import { LeadForm } from '../components/leads/LeadForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { LeadFormData } from '../types';

export const DashboardPage: React.FC = () => {
  const { leads, meta, filters, isLoading, error, fetchLeads, setFilters, createLead } = useLeadsStore();
  const { user } = useAuthStore();
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => { fetchLeads(); }, []);

  const handleCreate = async (data: LeadFormData) => {
    await createLead(data);
    setShowCreate(false);
    fetchLeads();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              Welcome back, {user?.name} · {user?.role === 'admin' ? 'Admin view' : 'Your leads'}
            </p>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            New Lead
          </Button>
        </div>

        {/* Stats */}
        <StatsBar leads={leads} />

        {/* Filters */}
        <LeadFilters />

        {/* Table */}
        {isLoading ? (
          <div className="py-16"><Spinner size="lg"/></div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
            <Button variant="secondary" size="sm" onClick={fetchLeads} className="mt-3">Try again</Button>
          </div>
        ) : (
          <LeadTable leads={leads} />
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <Pagination meta={meta} onPageChange={(page) => setFilters({ page })} />
        )}
      </main>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Lead">
        <LeadForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>
    </div>
  );
};
