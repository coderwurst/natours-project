const AppError = require('./../utils/appError');

const handleCaseErrorDB = error => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

const sendErrorDev = (error, response) => {
  response.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack
  });
};

const sendErrorProd = (error, response) => {
  if (error.isOperational) {
    // trusted error
    response.status(error.statusCode).json({
      status: error.status,
      message: error.message
    });
  } else {
    // programming errors to be logged to console
    console.error(`ERROR: ${error}`);
    // then generic message sent to client
    response.status(500).json({
      status: 'error',
      message: 'something went very wrong!'
    });
  }
};

module.exports = (error, request, response, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, response);
  } else if (process.env.NODE_ENV === 'production') {
    let err = { ...error };

    if (err.name === 'CastError') {
      err = handleCaseErrorDB(err);
    }

    sendErrorProd(err, response);
  }
};
