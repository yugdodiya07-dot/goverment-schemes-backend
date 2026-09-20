const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide scheme title'],
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    ministry: {
      type: String,
      required: [true, 'Please provide responsible ministry'],
      trim: true,
    },
    department: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Agriculture & Rural',
        'Education & Scholarships',
        'Healthcare & Insurance',
        'Housing & Shelter',
        'Entrepreneurship & MSME',
        'Women & Child Empowerment',
        'Financial Inclusion',
        'Skill Development',
      ],
    },
    categoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    shortDescription: {
      type: String,
      required: [true, 'Please provide short summary'],
    },
    fullDescription: {
      type: String,
      required: [true, 'Please provide complete scheme details'],
    },
    benefitType: {
      type: String,
      required: true,
      enum: [
        'Financial Assistance',
        'Subsidy',
        'Insurance Cover',
        'Scholarship',
        'Skill Training',
        'Loan & Credit Support',
      ],
    },
    benefitAmount: {
      type: String,
      required: [true, 'Please specify benefit amount or description'],
    },
    eligibilityCriteria: {
      minAge: { type: Number, default: 0 },
      maxAge: { type: Number, default: 100 },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Transgender', 'All'],
        default: 'All',
      },
      maxIncome: { type: Number, default: 100000000 },
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
      requiresDisability: { type: Boolean, default: false },
      requiredSpecialStatus: {
        type: [String],
        default: [],
      },
    },
    eligibilityRuleRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EligibilityRule',
    },
    requiredDocuments: {
      type: [String],
      default: ['Aadhaar Card', 'Bank Passbook', 'Passport Size Photo'],
    },
    officialWebsiteUrl: {
      type: String,
      default: '',
    },
    deadline: {
      type: String,
      default: 'Open All Year',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicationCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'schemes',
  }
);

// Add text index for search
schemeSchema.index({ title: 'text', shortDescription: 'text', ministry: 'text', fullDescription: 'text' });
// Indexes for search, filtering, and sorting performance
schemeSchema.index({ isActive: 1, category: 1, createdAt: -1 });
schemeSchema.index({ isActive: 1, ministry: 1 });

module.exports = mongoose.model('Scheme', schemeSchema);
