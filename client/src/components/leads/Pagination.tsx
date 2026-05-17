import React from 'react';
import { PaginationMeta } from '../../types';
import { Button } from '../ui/Button';

interface Props {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<Props> = ({ meta, onPageChange }) => {
  const { page, totalPages, total, limit } = meta;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing <span className="font-medium">{from}–{to}</span> of <span className="font-medium">{total}</span> leads
      </p>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" disabled={!meta.hasPrev} onClick={() => onPageChange(page - 1)}>← Prev</Button>
        <div className="flex gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const p = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
            return (
              <button key={p} onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                {p}
              </button>
            );
          })}
        </div>
        <Button variant="secondary" size="sm" disabled={!meta.hasNext} onClick={() => onPageChange(page + 1)}>Next →</Button>
      </div>
    </div>
  );
};
