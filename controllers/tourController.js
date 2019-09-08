const Tour = require('./../models/tourModel.js');

exports.getAllTours = async (request, response) => {
  try {
    console.log(request.query);
    // build query
    const queryObject = { ...request.query };
    // 1. filter out functional strings
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(element => {
      delete queryObject[element];
    });
    // 2. filter and replace comparison operators
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(/\b(gte|gte|gt|lt)\b/g, match => {
      return `$${match}`;
    });

    console.log(JSON.parse(queryString));
    let query = Tour.find(JSON.parse(queryString));

    // 3. sort by url param passed in
    if (request.query.sort) {
      const sortBy = request.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 4. field limiting
    if (request.query.fields) {
      const fields = request.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // execute query
    const tours = await query;

    // const allTours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // send response
    response.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours
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

exports.updateTour = async (request, response) => {
  try {
    const tour = await Tour.findByIdAndUpdate(request.params.id, request.body, {
      new: true, // returns updated document
      runValidators: true // runs checks against schema
    });

    response.status(200).json({
      status: 'success',
      data: {
        tour: tour
      }
    });
  } catch (error) {
    response.status(400).json({
      status: 'error',
      message: 'tour could not be updated'
    });
  }
};

exports.deleteTour = async (request, response) => {
  try {
    await Tour.findByIdAndDelete(request.params.id);

    response.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    response.status(400).json({
      status: 'error',
      message: 'tour could not be deleted'
    });
  }
};
