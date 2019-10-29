const AppError = require('./../utils/appError');
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
