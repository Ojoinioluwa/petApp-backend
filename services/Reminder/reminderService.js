const express = require('express');
const reminderRouter = express.Router();
const reminderCtrl   = require('../controllers/reminderCtrl');
const isAuth         = require('../../middlewares/isAuth');

// Create a reminder for a pet
reminderRouter.post(
  '/api/v1/pet/:petId/reminders',
  isAuth,
  reminderCtrl.createReminder
);

// Get all reminders for a pet
reminderRouter.get(
  '/api/v1/pet/:petId/reminders',
  isAuth,
  reminderCtrl.getReminderByPet
);

// Get a single reminder by its ID
reminderRouter.get(
  '/api/v1/reminders/:reminderId',
  isAuth,
  reminderCtrl.getReminderById
);

// Update a reminder
reminderRouter.put(
  '/api/v1/reminders/:reminderId',
  isAuth,
  reminderCtrl.updateReminder
);

// Delete a reminder
reminderRouter.delete(
  '/api/v1/reminders/:reminderId',
  isAuth,
  reminderCtrl.deleteReminder
);

// (Optional) Upcoming vs. Past
reminderRouter.get(
  '/api/v1/reminders/upcoming',
  isAuth,
  reminderCtrl.upcomingReminders
);
reminderRouter.get(
  '/api/v1/reminders/past',
  isAuth,
  reminderCtrl.pastReminders
);

module.exports = reminderRouter;
