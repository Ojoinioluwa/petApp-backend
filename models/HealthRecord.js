const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  type: {
    type: String,
    enum: ['Vaccination', 'Deworming', 'Treatment', 'Checkup', 'Other'],
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
  cost: {
    type: Number,
    min: 0
  },
  documents: [String], // could store URLs or filenames of attached records (e.g., scanned prescriptions)
}, {
  timestamps: true
});

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
