const Tour = require('../models/tourModel');
const User = require('../models/userModel');

const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (request, response, next) => {
  // get tours data
  const tours = await Tour.find();

  // render template using tour data
  response.status(200).render('overview', {
    title: 'Exciting tours for adventurous people',
    tours: tours
  });
});

exports.getTour = catchAsync(async (request, response, next) => {
  // get tours data
  const tour = await Tour.findOne({ slug: request.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }

  // fill template with populated data
  response.status(200).render('tour', {
    title: tour.name,
    tour: tour
  });
});

exports.getAccount = catchAsync(async (request, response) => {
  response.status(200).render('account', {
    title: 'Your Account'
  });
});

exports.getLoginForm = (request, response) => {
  response.status(200).render('login', {
    title: 'login'
  });
};

exports.getSignUpForm = (request, response) => {
  response.status(200).render('signup', {
    title: 'signup'
  });
};
