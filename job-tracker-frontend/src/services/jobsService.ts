import apiClient from './apiClient';
import { JobApplication, JobStatus, ApplicationEvent } from '../types/models';

export interface JobFilters {
  search?: string;
  status?: JobStatus | 'ALL';
  sortBy?: 'appliedDate' | 'companyName' | 'status' | 'salary';
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  company?: string;
  source?: string;
}

export interface JobsResponse {
  data: JobApplication[];
  total: number;
}

export const jobsService = {
  async list(filters: JobFilters): Promise<JobsResponse> {
    const res = await apiClient.get('/jobs', { params: filters });
    return {
      data: res.data.data,
      total: res.data.meta?.total || 0
    };
  },

  async getById(id: string): Promise<{ job: JobApplication; events: ApplicationEvent[] }> {
    const res = await apiClient.get(`/jobs/${id}`);
    return res.data;
  },

  async create(job: Partial<JobApplication>): Promise<JobApplication> {
    const res = await apiClient.post('/jobs', job);
    return res.data;
  },

  async update(id: string, job: Partial<JobApplication>): Promise<JobApplication> {
    const res = await apiClient.put(`/jobs/${id}`, job);
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/jobs/${id}`);
  }
};