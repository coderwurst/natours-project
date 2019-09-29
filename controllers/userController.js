const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.checkId = (request, response, next, value) => {
  console.log('hello from middleware 3');
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

exports.updateUser = catchAsync(async (request, response) => {
  const result = await User.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true
  });

  response.status(200).json({
    status: 'success',
    data: {
      user: result
    }
  });
});

exports.deleteUser = catchAsync(async (request, response) => {
  await User.findByIdAndDelete(request.params.id);

  response.status(204).json({
    status: 'success',
    data: null
  });
});
