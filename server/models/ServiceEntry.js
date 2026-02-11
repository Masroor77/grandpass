const mongoose = require('mongoose');

const serviceEntrySchema = new mongoose.Schema({
  tokenNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerMobile: {
    type: String,
    required: true,
  },
  mobileBrandModel: {
    type: String,
    required: true,
  },
  issueDescription: {
    type: String,
    required: true,
  },
  estimatedCharge: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Delivered'],
    default: 'Pending',
  },
  entryDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ServiceEntry', serviceEntrySchema);
