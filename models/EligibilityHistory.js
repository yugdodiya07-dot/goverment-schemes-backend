const mongoose = require('mongoose');

const eligibilityHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // null for anonymous checks
    },
    inputCriteria: {
      age: Number,
      gender: String,
      annualIncome: Number,
      occupation: String,
      category: String,
      state: String,
      district: String,
      disabilityStatus: Boolean,
      specialStatus: [String],
    },
    matchedSchemesCount: {
      type: Number,
      default: 0,
    },
    matchedSchemeIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scheme',
      },
    ],
  },
  {
    timestamps: true,
    collection: 'eligibility_history',
  }
);

eligibilityHistorySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('EligibilityHistory', eligibilityHistorySchema);
