const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllReviews = catchAsync(async (request, response, next) => {
  const reviews = await Review.find();

  response.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews: reviews
    }
  });
});

exports.createReview = catchAsync(async (request, response, next) => {
  // using nested tour route for adding to current tour by current user
  if (!request.body.tour) {
    request.body.tour = request.params.tourId;
  }

  if (!request.body.user) {
    request.body.user = request.user.id;
  }

  const newReview = await Review.create(request.body);

  response.status(201).json({
    status: 'create success',
    data: {
      review: newReview
    }
  });
});