import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lead, LeadFormData } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
  notes: z.string().optional(),
});

interface Props {
  lead?: Lead;
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel: () => void;
}

export const LeadForm: React.FC<Props> = ({ lead, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LeadFormData>({
    resolver: zodResolver(schema),
    defaultValues: lead ? {
      name: lead.name, email: lead.email, status: lead.status,
      source: lead.source, notes: lead.notes || '',
    } : { status: 'New', source: 'Website' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Full Name" placeholder="e.g. Rahul Sharma" error={errors.name?.message} {...register('name')} />
      <Input label="Email Address" type="email" placeholder="rahul@example.com" error={errors.email?.message} {...register('email')} />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Status" error={errors.status?.message}
          options={[
            { value: 'New', label: 'New' }, { value: 'Contacted', label: 'Contacted' },
            { value: 'Qualified', label: 'Qualified' }, { value: 'Lost', label: 'Lost' },
          ]}
          {...register('status')} />
        <Select label="Source" error={errors.source?.message}
          options={[
            { value: 'Website', label: 'Website' }, { value: 'Instagram', label: 'Instagram' },
            { value: 'Referral', label: 'Referral' },
          ]}
          {...register('source')} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optional)</label>
        <textarea
          rows={3}
          placeholder="Add any notes about this lead..."
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          {...register('notes')}
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isSubmitting} className="flex-1">
          {lead ? 'Save Changes' : 'Create Lead'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};
