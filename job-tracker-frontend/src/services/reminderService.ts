import apiClient from './apiClient';
import { Reminder } from '../types/models';

export const reminderService = {
  async list(): Promise<Reminder[]> {
    const res = await apiClient.get('/reminders');
    return res.data;
  },

  async create(data: Partial<Reminder>): Promise<Reminder> {
    const res = await apiClient.post('/reminders', data);
    return res.data;
  },

  async updateStatus(id: string, status: 'pending' | 'completed' | 'snoozed'): Promise<Reminder> {
    const res = await apiClient.patch(`/reminders/${id}/status`, { status });
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/reminders/${id}`);
  }
};
