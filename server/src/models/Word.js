const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  word: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  definition: {
    type: String,
    required: true,
  },
  example: {
    type: String,
    default: '',
  },
  partOfSpeech: {
    type: String,
    default: '',
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  nextReviewAt: {
    type: Date,
    default: () => new Date(),
  },
  lastReviewedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

wordSchema.index({ userId: 1, word: 1 }, { unique: true });
wordSchema.index({ userId: 1, nextReviewAt: 1 });

module.exports = mongoose.model('Word', wordSchema);
