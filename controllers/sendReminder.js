const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Reminder = require('../models/Reminder');
const User = require('../models/User');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Run daily at 4:00 AM
const scheduleReminders = () => {
  cron.schedule('0 4 * * *', async () => {
    console.log('Running daily reminder email task...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    try {
      const reminders = await Reminder.find({
        date: { $gte: today, $lt: tomorrow },
      }).lean();

      for (const reminder of reminders) {
        const user = await User.findById(reminder.userId).lean();
        if (!user?.email) continue;

        const mailOptions = {
          from: process.env.AUTH_EMAIL,
          to: user.email,
          subject: '🐾 Pet Health Reminder',
          text: `Hi there!\n\nYou have a reminder for your pet today:\n\nTitle: ${reminder.title}\nDescription: ${reminder.description}\nDate: ${reminder.date}\n\nTake good care of your furry friend!\n\n– Pet Health Tracker`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to ${user.email}`);
      }
    } catch (error) {
      console.error('Error sending reminder emails:', error.message);
    }
  });
};

module.exports = scheduleReminders;
