const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/APIFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.deleteOne = Model =>
  catchAsync(async (request, response, next) => {
    const doc = await Model.findByIdAndDelete(request.params.id);

    if (!doc) {
      return next(new AppError('no document found with the requested id', 404));
    }

    response.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (request, response, next) => {
    const doc = await Model.findByIdAndUpdate(request.params.id, request.body, {
      new: true, // returns updated document
      runValidators: true // runs checks against schema
    });

    if (!doc) {
      return next(new AppError('no document found with the requested id', 404));
    }

    response.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (request, response, next) => {
    const doc = await Model.create(request.body);

    response.status(201).json({
      status: 'create success',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (request, response, next) => {
    let query = Model.findById(request.params.id);

    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const doc = await query;

    if (!doc) {
      return next(new AppError('no tour found with the requested id', 404));
    }

    response.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (request, response, next) => {
    // execute query from class
    const features = new APIFeatures(Model.find(), request.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;

    // send response
    response.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs
      }
    });
  });
