import React from 'react';
import { Lead } from '../../types';

interface StatsCardsProps { leads: Lead[]; total: number }

export const StatsCards: React.FC<StatsCardsProps> = ({ leads, total }) => {
  const counts = {
    New: leads.filter((l) => l.status === 'New').length,
    Qualified: leads.filter((l) => l.status === 'Qualified').length,
    Lost: leads.filter((l) => l.status === 'Lost').length,
  };

  const stats = [
    { label: 'Total Leads', value: total, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
    { label: 'New', value: counts.New, color: 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400' },
    { label: 'Qualified', value: counts.Qualified, color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
    { label: 'Lost', value: counts.Lost, color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map(({ label, value, color }) => (
        <div key={label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  );
};
