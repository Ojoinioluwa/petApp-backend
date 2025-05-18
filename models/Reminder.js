const mongoose = require('mongoose');


const reminderSchema = new mongoose.Schema({
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['vaccination', 'deworming', 'treatment', 'checkup', 'Other'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  veterinarian: {
    type: String,
    trim: true
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Reminder', reminderSchema);