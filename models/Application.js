const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
      required: true,
    },
    applicantName: {
      type: String,
      required: [true, 'Applicant name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number'],
    },
    aadharNumber: {
      type: String,
      required: [true, 'Aadhaar number is required'],
      match: [/^\d{12}$/, 'Aadhaar number must be exactly 12 digits'],
    },
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    occupation: {
      type: String,
      default: '',
    },
    annualIncome: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      default: 'General',
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Verification', 'Document Verified', 'Approved', 'Rejected'],
      default: 'Submitted',
    },
    remarks: {
      type: String,
      default: 'Application successfully received and pending initial officer screening.',
    },
    documents: [
      {
        documentType: { type: String, required: true },
        filename: { type: String, required: true },
        path: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    timeline: [
      {
        stage: { type: String, required: true },
        status: { type: String, enum: ['completed', 'current', 'rejected', 'pending'], default: 'completed' },
        title: { type: String, required: true },
        comment: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now },
        officerName: { type: String, default: 'System / Verification Officer' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for query optimization
applicationSchema.index({ user: 1, createdAt: -1 });
applicationSchema.index({ scheme: 1 });
applicationSchema.index({ user: 1, scheme: 1, status: 1 });
applicationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);
