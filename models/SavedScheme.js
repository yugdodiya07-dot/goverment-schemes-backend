const mongoose = require('mongoose');

const savedSchemeSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
    collection: 'saved_schemes',
  }
);

// Compound unique index to prevent duplicate bookmark records
savedSchemeSchema.index({ user: 1, scheme: 1 }, { unique: true });

module.exports = mongoose.model('SavedScheme', savedSchemeSchema);
