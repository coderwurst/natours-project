const multer = require('multer');
const sharp = require('sharp');

const AppError = require('./../utils/appError');
const Tour = require('./../models/tourModel');

const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

// save to memory buffer
const multerStorage = multer.memoryStorage();

const multerFilter = (request, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new AppError('image format not recognised', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
  {
    name: 'imageCover',
    maxCount: 1
  },
  {
    name: 'images',
    maxCount: 3
  }
]);

exports.resizeTourImages = catchAsync(async (request, response, next) => {
  if (!request.files.imageCover || !request.files.images) return next();

  // cover image
  // add to request body to be included with updateOne middleware
  request.body.imageCover = `tour-${
    request.params.id
  }-${Date.now()}-cover.jpeg`;

  await sharp(request.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${request.body.imageCover}`);

  // tour images - initiate empty array to store images
  request.body.images = [];

  // map (instead of foreach) to store 3 promises returned from async loop
  // - awaits until all images have been processed
  await Promise.all(
    request.files.images.map(async (file, index) => {
      const filename = `tour-${request.params.id}-${Date.now()}-${index +
        1}.jpeg`;

      await sharp(file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      // add to images array to be included in tour updateOne
      request.body.images.push(filename);
    })
  );

  next();
});

exports.aliasTopTours = (request, response, next) => {
  request.query.limit = '5';
  request.query.sort = '-ratingsAverage,price';
  request.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.createTour = factory.createOne(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.updateTour = factory.updateOne(Tour);
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

exports.getToursWithin = catchAsync(async (request, response, next) => {
  const { distance, latlng, unit } = request.params;
  const [latitude, longitude] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!latitude || !longitude) {
    next(new AppError('invalid coordinates provided', 400));
  }

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [[longitude, latitude], radius]
      }
    }
  });

  response.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (request, response, next) => {
  const { latlng, unit } = request.params;
  const [latitude, longitude] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!latitude || !longitude) {
    next(new AppError('invalid coordinates provided', 400));
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [longitude * 1, latitude * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  response.status(200).json({
    status: 'success',
    results: distances.length,
    data: {
      data: distances
    }
  });
});
