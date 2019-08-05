const fs = require('fs')
const express = require('express');
const morgan = require('morgan')

const app = express();
// middleware
app.use(morgan('dev'));                         // https://github.com/expressjs/morgan/blob/master/index.js
app.use(express.json());                        // middleware to add data to request body

app.use((request, response, next) => {          // custom middleware function
    console.log('hello from the middleware');
    next();
});

app.use((request, response, next) => {
    request.requestTime = new Date().toISOString();
    next();
});

const database = `${__dirname}/dev-data/data/tours-simple.json`;

const tourData = JSON.parse(
    fs.readFileSync(database)
);

// route handlers
const getAllTours = (request, response) => {
    console.log(request.requestTime)
    response.status(200).json({
        status: 'success',
        requestedAt: request.requestTime,
        results: tourData.length,
        data: {
            tours: tourData
        }
    })
};

const getTour = (request, response) => {
    const id = request.params.id * 1;
    const tour = tourData.find(element => element.id === id);
    if (!tour) {
        return response.status(404).json({
            status: 'failed',
            message: 'invalid id'
        })
    }
    response.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
    })
};

const createTour = (request, response) => {
    const newId = tourData[tourData.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, request.body);       // Object.assign to merge 2 objects

    tourData.push(newTour);

    fs.writeFile(database, JSON.stringify(tourData), err => {
        response.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
};

const updateTour = (request, response) => {
    const id = request.params.id * 1;
    const tour = tourData.find(element => element.id === id);
    if (!tour) {
        return response.status(404).json({
            status: 'failed',
            message: 'invalid id'
        })
    }

    response.status(200).json({
        status: 'patch sim success',
        data: {
            tour: tour
        }
    })
};

const deleteTour = (request, response) => {
    const id = request.params.id * 1;
    const tour = tourData.find(element => element.id === id);
    if (!tour) {
        return response.status(404).json({
            status: 'failed',
            message: 'invalid id'
        })
    }

    response.status(204).json({
        status: 'delete sim success',
        data: null
    })
};

// routes
app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

// server
const port = 3000;
app.listen(port, () => {
    console.log(`app running on port: ${port}`)
});
