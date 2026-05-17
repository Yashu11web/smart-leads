import api from './axios';
import { ApiResponse, User } from '../types';

export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data),
  getMe: () => api.get<ApiResponse<{ user: User }>>('/auth/me'),
};
