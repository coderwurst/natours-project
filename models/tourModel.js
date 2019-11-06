const mongoose = require('mongoose');
const slugify = require('slugify');

// const user = require('./userModel.js');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      unique: true,
      trim: true,
      maxLength: [40, 'the name must have less than or equal to 40 characters'],
      minLength: [6, 'a tour name must have at least 6 chars']
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
      required: [true, 'each tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'the diffculty can only be easy, medium, or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rating must be above 1'],
      max: [5, 'rating must be below 5'],
      set: value => Math.round(value * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'price must be provided']
    },
    priceDiscount: {
      type: Number,
      validate: {
        message: 'discount price ({VALUE}) should be below regular price',
        validator: function(inputValue) {
          // mongoose gotcha - this. keyword only works on new doc generate (not on updates)
          return inputValue < this.price;
        }
      }
    },
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
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      descripton: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        descripton: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// compound index for price (ascending) and ratingsAverage (descending)
tourSchema.index({ price: 1, ratingsAverage: -1 });

// index for tour slug ascending
tourSchema.index({ slug: 1 });

// virtual property to determine # of weeks
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// pull reviews with the parent reference for each tourController.getTour ...populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', // link in review to this tour
  localField: '_id' // link form this model to review
});

// MIDDLEWARE EXAMPLES
// document middleware: pre-save hook - runs before .save() and create() (not .insertMany())
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next(); // call next middleware in stack
});

/*
embedded user example
tourSchema.pre('save', async function(next) {
  const guidesPromises = this.guides.map(async idElement =>
    user.findById(idElement)
  );
  // retrieve values from stored promises
  this.guides = await Promise.all(guidesPromises);
  next();
});
*/

/* document middleware: post-save hook - runs after pres have been completed, includes the saved document
  tourSchema.post('save', function(document, next) {
  console.log(document);
  next();
});*/

// query middleware: pre-find hook - filters out hidden tours from DB, for all querys with find at start (findOne, find, find and update)
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });

  next();
});

tourSchema.post(/^find/, function(document, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// aggregation pipeline - filter our secret tours for aggregations
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = new mongoose.model('Tour', tourSchema);

module.exports = Tour;
