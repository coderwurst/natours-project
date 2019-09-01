const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'price must be provided']
  }
});

const Tour = new mongoose.model('Tour', tourSchema);

module.exports = Tour;
