const Tour = require('./../models/tourModel.js');

exports.getAllTours = async (request, response) => {
  try {
    const allTours = await Tour.find();
    response.status(200).json({
      status: 'success',
      results: allTours.length,
      data: {
        tours: allTours
      }
    });
  } catch (error) {
    response.status(400).json({
      status: 'error',
      message: 'tours could not be retrieved'
    });
  }
};

exports.getTour = async (request, response) => {
  try {
    const tour = await Tour.findById(request.params.id);
    // alternatively - const tour = await Tour.findOne({_id: request.params.id});

    response.status(200).json({
      status: 'success',
      data: {
        tour: tour
      }
    });
  } catch (error) {
    response.status(400).json({
      status: 'error',
      message: 'tour could not be retrieved'
    });
  }
};

exports.createTour = async (request, response) => {
  try {
    const newTour = await Tour.create(request.body);

    response.status(201).json({
      status: 'create success',
      data: {
        tour: newTour
      }
    });
  } catch (error) {
    response.status(400).json({
      status: 'create failed',
      message: 'invalid data set'
    });
  }
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
