import apiClient from './apiClient';
import { JobApplication, JobStatus } from '../types/models';

export interface JobFilters {
  search?: string;
  status?: JobStatus | 'ALL';
  sortBy?: 'dateApplied' | 'status';
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface JobsResponse {
  data: JobApplication[];
  total: number;
}

export const jobsService = {
  // 🔥 GET JOBS (FIXED RESPONSE FORMAT)
  async list(filters: JobFilters): Promise<JobsResponse> {
    try {
      const res = await apiClient.get('/jobs', {
        params: filters
      });

      // 🔥 backend sends { data, meta }
      return {
        data: res.data.data,
        total: res.data.meta?.total || 0
      };
    } catch (err: any) {
      console.error('LIST ERROR:', err.response?.data || err.message);
      throw err;
    }
  },

  // 🔥 CREATE JOB (FULL DEBUG + SAFE)
  async create(job: Partial<JobApplication>): Promise<JobApplication> {
    try {
      console.log("🚀 SENDING JOB:", job);

      const res = await apiClient.post('/jobs', job);

      console.log("✅ CREATE RESPONSE:", res.data);

      return res.data;
    } catch (err: any) {
      console.error('❌ CREATE ERROR FULL:', err.response?.data || err.message);
      throw err;
    }
  },

  // 🔥 UPDATE JOB
  async update(id: string, job: Partial<JobApplication>): Promise<JobApplication> {
    try {
      const res = await apiClient.put(`/jobs/${id}`, job);
      return res.data;
    } catch (err: any) {
      console.error('UPDATE ERROR:', err.response?.data || err.message);
      throw err;
    }
  },

  // 🔥 DELETE JOB
  async remove(id: string): Promise<void> {
    try {
      await apiClient.delete(`/jobs/${id}`);
    } catch (err: any) {
      console.error('DELETE ERROR:', err.response?.data || err.message);
      throw err;
    }
  }
};