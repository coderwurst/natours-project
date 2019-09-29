const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (request, response, next) => {
  const newUser = await User.create({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    passwordConfirm: request.body.passwordConfirm
  });

  const token = signToken(newUser._id);

  response.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (request, response, next) => {
  const { email, password } = request.body;

  // check if request valid
  if (!email || !password) {
    return next(new AppError('please provide an email and password', 400));
  }

  // check for user and return email and password (select=false hides password)
  const user = await User.findOne({ email: email }).select('+password');

  // check password if user has been found
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email or password', 401));
  }

  // create token
  const token = signToken(user._id);

  // send to client
  response.status(200).json({
    status: 'success',
    token
  });
});
