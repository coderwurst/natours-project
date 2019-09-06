const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    unique: true
  },
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
    default: Date.now()
  },
  startDates: [Date]
});

const Tour = new mongoose.model('Tour', tourSchema);

module.exports = Tour;
