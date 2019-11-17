const Tour = require('../models/tourModel');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (request, response) => {
  // get tours data from FeatureCollection
  const tours = await Tour.find();

  // build template

  // render template using tour data

  response.status(200).render('overview', {
    title: 'Exciting tours for adventurous people',
    tours: tours
  });
});

exports.getTour = (request, response) => {
  response.status(200).render('tour', {
    title: 'The Forest Hiker'
  });
};
