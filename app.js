const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express(); // https://expressjs.com/en/api.html

// middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // https://github.com/expressjs/morgan/blob/master/index.js
}

app.use(express.json()); // middleware to add data to request body
app.use(express.static(`${__dirname}/public`)); // serving static files

/*app.use((request, response, next) => {
  // custom middleware function
  console.log('hello from middleware 1');
  next();
});

app.use((request, response, next) => {
  console.log('hello from middleware 2');
  request.requestTime = new Date().toISOString();
  next();
});*/

// mount the routers, applying the specified middleware routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
