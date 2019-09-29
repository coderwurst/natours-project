const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (request, response, next) => {
  const newUser = await User.create({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    passwordConfirm: request.body.passwordConfirm
  });

  response.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});
