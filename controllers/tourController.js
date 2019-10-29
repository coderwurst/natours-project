const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/APIFeatures');

const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTopTours = (request, response, next) => {
  request.query.limit = '5';
  request.query.sort = '-ratingsAverage,price';
  request.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (request, response, next) => {
  // execute query from class
  const features = new APIFeatures(Tour.find(), request.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  // send response
  response.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours
    }
  });
});

exports.getTour = catchAsync(async (request, response, next) => {
  const tour = await Tour.findById(request.params.id).populate('reviews');
  // alternatively - const tour = await Tour.findOne({_id: request.params.id});

  if (!tour) {
    return next(new AppError('no tour found with the requested id', 404));
  }

  response.status(200).json({
    status: 'success',
    data: {
      tour: tour
    }
  });
});

exports.createTour = catchAsync(async (request, response, next) => {
  const newTour = await Tour.create(request.body);

  response.status(201).json({
    status: 'create success',
    data: {
      tour: newTour
    }
  });
});

exports.updateTour = catchAsync(async (request, response, next) => {
  const tour = await Tour.findByIdAndUpdate(request.params.id, request.body, {
    new: true, // returns updated document
    runValidators: true // runs checks against schema
  });

  if (!tour) {
    return next(new AppError('no tour found with the requested id', 404));
  }

  response.status(200).json({
    status: 'success',
    data: {
      tour: tour
    }
  });
});

exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (request, response, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 }
      }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);

  response.status(200).json({
    status: 'success',
    data: stats
  });
});

exports.getMonthlyPlan = catchAsync(async (request, response, next) => {
  const year = request.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: {
        numOfTourStarts: -1
      }
    },
    {
      $limit: 12
    }
  ]);

  response.status(200).json({
    status: 'success',
    data: plan
  });
});
