const { promisify } = require('util');
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
    passwordConfirm: request.body.passwordConfirm,
    passwordChangedAt: request.body.passwordChangedAt
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

exports.protect = catchAsync(async (request, response, next) => {
  // 1. get token
  let token;
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith('Bearer')
  ) {
    token = request.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('User not logged in', 401));
  }

  // 2. verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. check if user still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('User not found!', 401));
  }

  // 4. check if user changed password after token creation
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password!', 401));
  }

  // 5. allow access to protected route
  request.user = user;
  next();
});
