const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const sendEmail = require('./../utils/email');
const User = require('../models/userModel');

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createAndSendToken = (user, statusCode, response) => {
  const token = signToken(user._id);

  response.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user
    }
  });
};

exports.signup = catchAsync(async (request, response, next) => {
  const newUser = await User.create({
    name: request.body.name,
    email: request.body.email,
    role: request.body.role,
    password: request.body.password,
    passwordConfirm: request.body.passwordConfirm,
    passwordChangedAt: request.body.passwordChangedAt
  });

  createAndSendToken(newUser, 201, response);
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

  createAndSendToken(user, 200, response);
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
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('User not found!', 401));
  }

  // 4. check if user changed password after token creation
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password!', 401));
  }

  // 5. allow access to protected route
  request.user = currentUser;
  next();
});

// closure example
exports.restrictTo = (...roles) => {
  return (request, response, next) => {
    // role stored in protect middleware on request
    if (!roles.includes(request.user.role)) {
      return next(new AppError('no permission to perform action', 403));
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (request, response, next) => {
  // 1. get user based on email address
  const currentUser = await User.findOne({ email: request.body.email });
  if (!currentUser) {
    return next(new AppError('user is not known'), 404);
  }

  // 2. generate token and save to user
  const resetToken = currentUser.generateResetToken();
  await currentUser.save({ validateBeforeSave: false });

  // 3. send to users email
  const resetURL = `${request.protocol}://${request.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a patch request with your new password and passwordConfirm to:${resetURL}.\nIf you didn't request a reset, ignore this message`;

  try {
    await sendEmail({
      email: currentUser.email,
      subject: 'Reset Password within the next 10 minutes',
      message
    });

    response.status(200).json({
      status: 'success',
      message: 'token sent to email'
    });
  } catch (error) {
    // revert changes
    currentUser.passwordResetToken = undefined;
    currentUser.passwordResetExpires = undefined;
    await currentUser.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error when sending the reset mail. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (request, response, next) => {
  // 1. get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(request.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Token invalid'), 400);
  }

  // 2. set new password if token has not expired
  user.password = request.body.password;
  user.passwordConfirm = request.body.passwordConfirm;
  // changedPasswordAt updated via middleware in userModel
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createAndSendToken(user, 200, response);
});

exports.updatePassword = catchAsync(async (request, response, next) => {
  const { currentPassword, newPassword, newPasswordConfirm } = request.body;

  // 1. check if request valid
  if (!currentPassword || !newPassword || !newPasswordConfirm) {
    return next(new AppError('please provide all required information', 400));
  }

  // 2. get user from collection with (usually hidden) password
  const user = await User.findById(request.user.id).select('+password');

  // 3. check if currentPassword is correct
  if (!user || !(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('incorrect email or password', 401));
  }

  // 4. update password to user (encryption happens in middleware)
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  createAndSendToken(user, 200, response);
});
