const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'closed'],
    default: 'pending',
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  relatedAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
  imgId: {
    type: String,
    required: true,
  },
});

reportSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const Report = mongoose.model('Report', reportSchema, 'Reports');

module.exports = Report;
