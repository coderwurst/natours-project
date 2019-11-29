const AppError = require('./../utils/appError');

const handleCaseErrorDB = error => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldNamesDB = error => {
  const value = error.errmsg.match(/(["'])(\\?.)*?\1/);
  const message = `Duplicate field value: ${value}, please use a unique value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = error => {
  const errors = Object.values(error.errors).map(element => element.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('token invalid, please login to continue', 401);

const handleJWTExpiredError = () =>
  new AppError('token expired, please login again to continue', 401);

const sendErrorDev = (error, request, response) => {
  // API ERROR
  if (request.originalUrl.startsWith('/api')) {
    return response.status(error.statusCode).json({
      status: error.status,
      error: error,
      message: error.message,
      stack: error.stack
    });
  }
  // RENDERED WEBSITE
  return response.status(error.statusCode).render('errorTemplate', {
    title: ' Uh oh! Something went wrong!',
    message: error.message
  });
};

const sendErrorProd = (error, request, response) => {
  // API ERROR
  if (request.originalUrl.startsWith('/api')) {
    if (error.isOperational) {
      // trusted error
      return response.status(error.statusCode).json({
        status: error.status,
        message: error.message
      });
    }
    // programming errors to be logged to console - not leaked to FE
    console.error(`ERROR: ${error}`);
    // then generic message sent to client
    return response.status(500).json({
      status: 'error',
      message: 'something went very wrong!'
    });
  }

  // RENDERED WEBSITE
  if (error.isOperational) {
    // trusted error
    return response.status(error.statusCode).render('errorTemplate', {
      title: ' Uh oh! Something went wrong!',
      message: error.message
    });
  }
  // programming errors to be logged to console - not leaked to FE
  console.error(`ERROR: ${error}`);
  // then generic message sent to client
  return response.status(error.statusCode).render('errorTemplate', {
    title: ' Uh oh! Something went wrong!',
    message: error.message
  });
};

module.exports = (error, request, response, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, request, response);
  } else if (process.env.NODE_ENV === 'production') {
    let err = { ...error };
    err.message = error.message;

    if (err.name === 'CastError') {
      err = handleCaseErrorDB(err);
    }

    if (err.code === 11000) {
      err = handleDuplicateFieldNamesDB(err);
    }

    if (err.name === 'ValidationError') {
      err = handleValidationErrorDB(err);
    }

    if (err.name === 'JsonWebTokenError') {
      err = handleJWTError();
    }

    if (err.name === 'TokenExpiredError') {
      err = handleJWTExpiredError();
    }

    sendErrorProd(err, request, response);
  }
};
