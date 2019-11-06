const mongoose = require('mongoose');
const Tour = require('./tourModel');

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

reviewSchema.pre(/^find/, function(next) {
  this /*.populate({
    path: 'tour',
    select: 'name'
  })*/.populate({
    path: 'user',
    select: 'name photo'
  });

  next();
});

// static method on Review Model
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  // this. points to schema
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  // persist data into tour document
  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: stats[0].nRating,
    ratingsQuantity: stats[0].avgRating
  });
};

reviewSchema.post('save', function() {
  /* this.constructor points to current review, before Review object
   * has been instantiated (which would be too late for adding the
   * new review data */
  this.constructor.calcAverageRatings(this.tour);
});

const Review = new mongoose.model('Review', reviewSchema);

module.exports = Review;
