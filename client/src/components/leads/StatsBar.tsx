import React from 'react';
import { Lead, LeadStatus } from '../../types';

interface Props { leads: Lead[] }

const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const colors: Record<LeadStatus, string> = {
  New: 'text-blue-600 dark:text-blue-400',
  Contacted: 'text-yellow-600 dark:text-yellow-400',
  Qualified: 'text-green-600 dark:text-green-400',
  Lost: 'text-red-600 dark:text-red-400',
};

export const StatsBar: React.FC<Props> = ({ leads }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
    {statuses.map((status) => {
      const count = leads.filter((l) => l.status === status).length;
      return (
        <div key={status} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{status}</p>
          <p className={`text-2xl font-bold ${colors[status]}`}>{count}</p>
        </div>
      );
    })}
  </div>
);
