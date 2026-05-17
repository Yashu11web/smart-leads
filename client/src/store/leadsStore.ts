import { create } from 'zustand';
import { Lead, LeadFilters, LeadFormData, PaginationMeta } from '../types';
import { leadsApi } from '../api/leads';

interface LeadsState {
  leads: Lead[];
  meta: PaginationMeta | null;
  filters: LeadFilters;
  isLoading: boolean;
  error: string | null;
  fetchLeads: () => Promise<void>;
  setFilters: (f: Partial<LeadFilters>) => void;
  createLead: (data: LeadFormData) => Promise<void>;
  updateLead: (id: string, data: Partial<LeadFormData>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  exportLeads: () => Promise<void>;
}

export const useLeadsStore = create<LeadsState>((set, get) => ({
  leads: [],
  meta: null,
  filters: { sort: 'latest', page: 1 },
  isLoading: false,
  error: null,

  setFilters: (f) => {
    set((s) => ({ filters: { ...s.filters, ...f, page: f.page ?? 1 } }));
    get().fetchLeads();
  },

  fetchLeads: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await leadsApi.getAll(get().filters);
      set({ leads: res.data.data || [], meta: res.data.meta || null, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Failed to fetch leads' });
    }
  },

  createLead: async (data) => {
    const res = await leadsApi.create(data);
    set((s) => ({ leads: [res.data.data!, ...s.leads] }));
  },

  updateLead: async (id, data) => {
    const res = await leadsApi.update(id, data);
    set((s) => ({ leads: s.leads.map((l) => (l._id === id ? res.data.data! : l)) }));
  },

  deleteLead: async (id) => {
    await leadsApi.delete(id);
    set((s) => ({ leads: s.leads.filter((l) => l._id !== id) }));
  },

  exportLeads: async () => {
    const res = await leadsApi.export(get().filters);
    const url = URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },
}));
