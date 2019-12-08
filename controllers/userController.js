const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

// save to disk storage example
// const multerStorage = multer.diskStorage({
//   destination: (request, response, callback) => {
//     callback(null, 'public/img/users');
//   },
//   filename: (request, file, callback) => {
//     const extension = file.mimetype.split('/')[1];
//     callback(null, `user-${request.user.id}-${Date.now()}.${extension}`);
//   }
// });

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

exports.uploadUserPhoto = upload.single('photo');

const filterObject = (body, ...allowedFields) => {
  const newObject = {};
  Object.keys(body).forEach(element => {
    if (allowedFields.includes(element)) {
      newObject[element] = body[element];
    }
  });
  return newObject;
};

exports.resizeUserPhoto = (request, response, next) => {
  if (!request.file) return next();

  request.file.filename = `user-${request.user.id}-${Date.now()}.jpeg`;

  sharp(request.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${request.file.filename}`);

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
  if (request.file) {
    filteredBody.photo = request.file.filename;
  }

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
