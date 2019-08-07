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

exports.getUser = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'route not yet defined'
  });
};

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
