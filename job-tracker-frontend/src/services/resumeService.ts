import apiClient from './apiClient';
import { Resume } from '../types/models';

export const resumeService = {
  async list(): Promise<Resume[]> {
    const res = await apiClient.get('/resumes');
    return res.data;
  },

  async create(data: Partial<Resume>): Promise<Resume> {
    const res = await apiClient.post('/resumes', data);
    return res.data;
  },

  async update(id: string, data: Partial<Resume>): Promise<Resume> {
    const res = await apiClient.put(`/resumes/${id}`, data);
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/resumes/${id}`);
  }
};
