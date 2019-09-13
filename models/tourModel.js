const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      unique: true
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'each tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'each tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'each tour must have a difficulty']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'price must be provided']
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'each tour must have a descritpion']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'each tour must come with a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// virtual property to determine # of weeks
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// document middleware: pre-save hook - runs before .save() and create() (not .insertMany())
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next(); // call next middleware in stack
});

// document middleware: post-save hook - runs after pres have been completed, includes the saved document
// tourSchema.post('save', function(document, next) {
//   console.log(document);
//   next();
// });

// query middleware: pre-find hook - filters out hidden tours from DB, for all querys with find at start (findOne, find, find and update)
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(document, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Tour = new mongoose.model('Tour', tourSchema);

module.exports = Tour;
