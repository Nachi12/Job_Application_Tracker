import { Reminder } from '../models/Reminder.js';
import { ApiError } from '../utils/ApiError.js';

export const reminderService = {
  async getReminders(userId) {
    return Reminder.find({ userId }).populate('applicationId').sort({ dueDate: 1 });
  },

  async createReminder(userId, data) {
    const { title, applicationId, type, dueDate, notes } = data;
    if (!title || !dueDate) {
      throw new ApiError(400, 'Title and due date are required.');
    }

    return Reminder.create({
      userId,
      applicationId: applicationId || undefined,
      title: title.trim(),
      type: type || 'follow_up',
      dueDate: new Date(dueDate),
      notes: notes || ''
    });
  },

  async updateReminderStatus(userId, reminderId, status) {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: reminderId, userId },
      { status },
      { new: true }
    );
    if (!reminder) throw new ApiError(404, 'Reminder not found');
    return reminder;
  },

  async deleteReminder(userId, reminderId) {
    const reminder = await Reminder.findOneAndDelete({ _id: reminderId, userId });
    if (!reminder) throw new ApiError(404, 'Reminder not found');
    return true;
  }
};
