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

exports.getAllUsers = catchAsync(async (request, response, next) => {
  const users = await User.find();

  response.status(200).json({
    status: 'success',
    data: {
      users: users
    }
  });
});

exports.getUser = catchAsync(async (request, response, next) => {
  const user = await User.findById(request.params.id);

  response.status(200).json({
    status: 'success',
    data: {
      user: user
    }
  });
});

exports.createUser = catchAsync(async (request, response) => {
  const newUser = await User.create(request.body);

  response.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});

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
