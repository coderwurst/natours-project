module.exports = (error, request, response, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    response.status(error.statusCode).json({
      status: error.status,
      error: error,
      message: error.message,
      stack: error.stack
    });
  } else if (process.env.NODE_ENV === 'production') {
    response.status(error.statusCode).json({
      status: error.status,
      message: error.message
    });
  }
};
