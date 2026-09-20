const mongoose = require('mongoose');

const eligibilityRuleSchema = new mongoose.Schema(
  {
    scheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
      required: true,
      unique: true,
    },
    minAge: {
      type: Number,
      default: 0,
    },
    maxAge: {
      type: Number,
      default: 100,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Transgender', 'All'],
      default: 'All',
    },
    maxIncome: {
      type: Number,
      default: 100000000,
    },
    eligibleOccupations: {
      type: [String],
      default: ['All'],
    },
    eligibleStates: {
      type: [String],
      default: ['All'],
    },
    eligibleCategories: {
      type: [String],
      default: ['All'],
    },
    requiresDisability: {
      type: Boolean,
      default: false,
    },
    requiredSpecialStatus: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'eligibility_rules',
  }
);

module.exports = mongoose.model('EligibilityRule', eligibilityRuleSchema);
