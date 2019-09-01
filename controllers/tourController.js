const Tour = require('./../models/tourModel.js');

exports.getAllTours = (request, response) => {
  response.status(200).json({
    status: 'success'
    /* requestedAt: request.requestTime,
    results: tourData.length,
    data: {
      tours: tourData
    } */
  });
};

exports.getTour = (request, response) => {
  const id = request.params.id * 1;
  /* const tour = tourData.find(element => element.id === id);
  response.status(200).json({
    status: 'success',
    data: {
      tour: tour
    }
  }); */
};

exports.createTour = (request, response) => {
  response.status(201).json({
    status: 'create success'
    /*  data: {
      tour: newTour
    } */
  });
};

exports.updateTour = (request, response) => {
  const id = request.params.id * 1;
  /* const tour = tourData.find(element => element.id === id);
  response.status(200).json({
    status: 'patch sim success',
    data: {
      tour: tour
    }
  }); */
};

exports.deleteTour = (request, response) => {
  response.status(204).json({
    status: 'delete sim success',
    data: null
  });
};
