const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  slNo: {
    type: Number,
    auto: true
  },
  passengerName: {
    type: String,
    required: true,
    trim: true
  },
  passport: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  registrationNo: {
    type: String,
    required: true,
    trim: true
  },
  report: {
    type: String,
    enum: ['FIT', 'UNFIT', 'HELD-UP'],
    default: 'FIT'
  },
  wafidStatus: {
    type: String,
    enum: ['Approved', 'Pending', 'Rejected', 'On Hold'],
    default: 'Pending'
  },
  unfitCom: {
    type: String,
    trim: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  slipFileSubmit: {
    type: Boolean,
    default: false
  },
  sender: {
    type: String,
    trim: true
  },
  slipPaymentReceive: {
    type: Number,
    default: 0
  },
  commission: {
    type: Number,
    default: 0
  },
  slipPaymentSend: {
    type: Number,
    default: 0
  },
  profitMargin: {
    type: Number,
    default: 0
  },
  code: {
    type: String,
    trim: true
  },
  remark: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
passengerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update the updatedAt field before updating
passengerSchema.pre('findByIdAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Passenger', passengerSchema);
