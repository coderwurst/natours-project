const User = require('../models/userModel');

const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObject = (body, ...allowedFields) => {
  const newObject = {};
  Object.keys(body).forEach(element => {
    if (allowedFields.includes(element)) {
      newObject[element] = body[element];
    }
  });
  return newObject;
};

exports.checkId = (request, response, next, value) => {
  next();
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);

// ADMIN FUNCTIONALITY
exports.updateUser = catchAsync(async (request, response, next) => {
  // 1. prevent user from trying to update password
  if (request.body.password || request.body.passwordConfirm) {
    return next(
      new AppError(
        'Password cannot be updated at this endpoint - please use /updatePassword',
        400
      )
    );
  }

  // 2. update user document, filtering out only fields that are able to be udpated
  const filteredBody = filterObject(request.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(
    request.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
  );

  response.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteUser = factory.deleteOne(User);

// USER FUNCTIONALITY
exports.getMe = (request, response, next) => {
  request.params.id = request.user.id;
  next();
};

exports.updateMe = catchAsync(async (request, response, next) => {
  const filteredBody = filterObject(request.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(
    request.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
  );

  response.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });

  next();
});

exports.deleteMe = catchAsync(async (request, response, next) => {
  await User.findByIdAndUpdate(request.user.id, { active: false });

  response.status(204).json({
    status: 'success',
    data: null
  });
});
