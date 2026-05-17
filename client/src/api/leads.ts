import api from './axios';
import { ApiResponse, Lead, LeadFilters, LeadFormData } from '../types';

export const leadsApi = {
  getAll: (filters: LeadFilters) =>
    api.get<ApiResponse<Lead[]>>('/leads', { params: filters }),
  getOne: (id: string) => api.get<ApiResponse<Lead>>(`/leads/${id}`),
  create: (data: LeadFormData) => api.post<ApiResponse<Lead>>('/leads', data),
  update: (id: string, data: Partial<LeadFormData>) =>
    api.put<ApiResponse<Lead>>(`/leads/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<null>>(`/leads/${id}`),
  export: (filters: LeadFilters) =>
    api.get('/leads/export', { params: filters, responseType: 'blob' }),
};
