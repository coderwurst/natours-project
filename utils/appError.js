class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // capture stack trace, exculuding this class
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
