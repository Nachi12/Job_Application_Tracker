import { reminderService } from '../services/reminderService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getReminders = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const reminders = await reminderService.getReminders(userId);
  res.json(reminders);
});

export const createReminder = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const reminder = await reminderService.createReminder(userId, req.body);
  res.status(201).json(reminder);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const { id } = req.params;
  const { status } = req.body;
  const reminder = await reminderService.updateReminderStatus(userId, id, status);
  res.json(reminder);
});

export const deleteReminder = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const { id } = req.params;
  await reminderService.deleteReminder(userId, id);
  res.status(204).send();
});
