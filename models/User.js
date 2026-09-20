const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email address'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['citizen', 'admin'],
      default: 'citizen',
    },
    status: {
      type: String,
      enum: ['Active', 'Blocked', 'Deleted'],
      default: 'Active',
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number'],
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    district: {
      type: String,
      default: '',
    },
    age: {
      type: Number,
      default: null,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Transgender', 'All', ''],
      default: '',
    },
    annualIncome: {
      type: Number,
      default: null,
    },
    occupation: {
      type: String,
      enum: [
        'Farmer',
        'Student',
        'Employed',
        'Self-Employed',
        'Business',
        'Artisan',
        'Street Vendor',
        'Unemployed',
        'Other',
        '',
      ],
      default: '',
    },
    category: {
      type: String,
      enum: ['General', 'OBC', 'SC', 'ST', 'EWS', 'All', ''],
      default: '',
    },
    disabilityStatus: {
      type: Boolean,
      default: false,
    },
    specialStatus: {
      type: [String],
      default: [],
    },
    savedSchemes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scheme',
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Indexes for query optimization
userSchema.index({ role: 1, status: 1 });
userSchema.index({ resetPasswordToken: 1 }, { sparse: true });

// Encrypt password using bcrypt before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to match entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
