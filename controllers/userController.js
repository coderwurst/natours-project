const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.checkId = (request, response, next, value) => {
  console.log('hello from middleware 3');
  // TODO: error handling
  next();
};

exports.getAllUsers = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'route not yet defined'
  });
};

exports.getUser = catchAsync(async (request, response, next) => {
  const user = await User.findById(request.params.id);

  response.status(200).json({
    status: 'success',
    data: {
      user: user
    }
  });
});

exports.createUser = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'route not yet defined'
  });
};

exports.updateUser = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'route not yet defined'
  });
};

exports.deleteUser = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'route not yet defined'
  });
};
