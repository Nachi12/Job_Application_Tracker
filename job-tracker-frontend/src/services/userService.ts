import apiClient from './apiClient';
import { User, SubscriptionPlan } from '../types/models';

export const userService = {
  async updateProfile(payload: Partial<User>): Promise<User> {
    const { data } = await apiClient.put<User>('/users/me', payload);
    return data;
  },
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/users/change-password', {
      currentPassword,
      newPassword
    });
  },
  async changePlan(plan: SubscriptionPlan): Promise<User> {
    const { data } = await apiClient.post<User>('/users/change-plan', { plan });
    return data;
  }
};