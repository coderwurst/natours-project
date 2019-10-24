const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'review cannot be empty'],
      trim: true,
      maxLength: [200, 'the review must be less than 200 characters'],
      minLength: [6, 'the review must have at least 6 chars']
    },
    rating: {
      type: Number,
      required: [true, 'rating cannot be empty'],
      min: [1, 'rating must be above 1'],
      max: [5, 'rating must be below 5']
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must belong to an author']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Review = new mongoose.model('Review', reviewSchema);

module.exports = Review;
