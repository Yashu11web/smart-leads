import React, { useState, useEffect } from 'react';
import { useLeadsStore } from '../../store/leadsStore';
import { useDebounce } from '../../hooks/useDebounce';
import { LeadStatus, LeadSource } from '../../types';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

export const LeadFilters: React.FC = () => {
  const { filters, setFilters, exportLeads } = useLeadsStore();
  const [search, setSearch] = useState(filters.search || '');
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setFilters({ search: debouncedSearch, page: 1 });
  }, [debouncedSearch]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3 flex-wrap">
      <div className="flex-1 min-w-48">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <Select
        options={[
          { value: '', label: 'All Statuses' },
          { value: 'New', label: 'New' }, { value: 'Contacted', label: 'Contacted' },
          { value: 'Qualified', label: 'Qualified' }, { value: 'Lost', label: 'Lost' },
        ]}
        value={filters.status || ''}
        onChange={(e) => setFilters({ status: e.target.value as LeadStatus | '' })}
        className="w-40"
      />

      <Select
        options={[
          { value: '', label: 'All Sources' },
          { value: 'Website', label: 'Website' }, { value: 'Instagram', label: 'Instagram' },
          { value: 'Referral', label: 'Referral' },
        ]}
        value={filters.source || ''}
        onChange={(e) => setFilters({ source: e.target.value as LeadSource | '' })}
        className="w-40"
      />

      <Select
        options={[{ value: 'latest', label: 'Latest First' }, { value: 'oldest', label: 'Oldest First' }]}
        value={filters.sort || 'latest'}
        onChange={(e) => setFilters({ sort: e.target.value as 'latest' | 'oldest' })}
        className="w-40"
      />

      <Button variant="secondary" size="md" onClick={exportLeads} className="flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        Export CSV
      </Button>
    </div>
  );
};
