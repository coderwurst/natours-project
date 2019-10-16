const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express(); // https://expressjs.com/en/api.html

// middlewares - GLOBAL SCOPE
// set security http headers
app.use(helmet());

// dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // https://github.com/expressjs/morgan/blob/master/index.js
}

// prevent dos attacks from single IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'request limit exceeded'
});
app.use('/api', limiter);

// body parser - reading data from body into request.body to 10KB
app.use(express.json({ limit: '10kb' }));

// sanitize data against nosql injection after body has been parsed by filtering out $ and .
app.use(mongoSanitize());

// sanitize against Cross Site Scripting attacks by cleaning html code (removing symbols)
app.use(xss());

// serving static files
app.use(express.static(`${__dirname}/public`));

// prevent param pollution ?sort=duration&sort=price but allow 2 sorts for whitelisted items
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// mount the routers, applying the specified middleware routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// test middleware to view request headers
app.use((request, response, next) => {
  request.requestTime = new Date().toISOString();
  // console.log(request.headers);
  next();
});

// if code reaches here, there were no routers to match the request
app.all('*', (request, response, next) => {
  next(new AppError(`can't find ${request.originalUrl}!`, 404));
});

// global error handling in middleware
app.use(globalErrorHandler);

module.exports = app;
