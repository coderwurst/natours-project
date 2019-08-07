const fs = require('fs');

const database = `${__dirname}/../dev-data/data/tours-simple.json`;

const tourData = JSON.parse(fs.readFileSync(database));

exports.checkId = (request, response, next, value) => {
  console.log('hello from middleware checkId');
  if (value > tourData.length) {
    return response.status(404).json({
      status: 'failed',
      message: 'invalid id'
    });
  }
  next();
};

exports.checkBody = (request, response, next) => {
  console.log('hello from middleware check body');
  if (request.body.name == null || request.body.price == null) {
    return response.status(400).json({
      status: 'failed',
      message: 'missing name or price'
    });
  }
  next();
};

exports.getAllTours = (request, response) => {
  response.status(200).json({
    status: 'success',
    requestedAt: request.requestTime,
    results: tourData.length,
    data: {
      tours: tourData
    }
  });
};

exports.getTour = (request, response) => {
  const id = request.params.id * 1;
  const tour = tourData.find(element => element.id === id);
  response.status(200).json({
    status: 'success',
    data: {
      tour: tour
    }
  });
};

exports.createTour = (request, response) => {
  const newId = tourData[tourData.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, request.body); // Object.assign to merge 2 objects

  tourData.push(newTour);

  fs.writeFile(database, JSON.stringify(tourData), err => {
    response.status(201).json({
      status: 'create success',
      data: {
        tour: newTour
      }
    });
  });
};

exports.updateTour = (request, response) => {
  const id = request.params.id * 1;
  const tour = tourData.find(element => element.id === id);
  response.status(200).json({
    status: 'patch sim success',
    data: {
      tour: tour
    }
  });
};

exports.deleteTour = (request, response) => {
  response.status(204).json({
    status: 'delete sim success',
    data: null
  });
};
