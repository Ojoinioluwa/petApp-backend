const express = require('express');
const reminderRouter = express.Router();
const isAuth         = require('../../middlewares/isAuth');
const reminderController = require('../../controllers/ReminderCtrl');

// Create a reminder for a pet
reminderRouter.post(
  '/api/v1/pet/:petId/reminders',
  isAuth,
  reminderController.createReminder
);

// Get all reminders for a pet
reminderRouter.get(
  '/api/v1/pet/:petId/reminders',
  isAuth,
  reminderController.getReminderByPet
);

// Get a single reminder by its ID
reminderRouter.get(
  '/api/v1/reminders/:reminderId',
  isAuth,
  reminderController.getReminderById
);

// Update a reminder
reminderRouter.put(
  '/api/v1/reminders/:reminderId',
  isAuth,
  reminderController.updateReminder
);

// Delete a reminder
reminderRouter.delete(
  '/api/v1/reminders/:reminderId',
  isAuth,
  reminderController.deleteReminder
);

// (Optional) Upcoming vs. Past
reminderRouter.get(
  '/api/v1/reminders/upcoming',
  isAuth,
  reminderController.upcomingReminders
);
reminderRouter.get(
  '/api/v1/reminders/past',
  isAuth,
  reminderController.pastReminders
);

module.exports = reminderRouter;
