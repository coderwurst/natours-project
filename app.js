const fs = require('fs')
const express = require('express');

const app = express();

app.use(express.json());        // middleware to add data to request body

const database = `${__dirname}/dev-data/data/tours-simple.json`;

// routing app.http-method.url
// app.get('/', (request, response) => {        // root
//     response
//     .status(200)
//     .json(
//         {   message: 'hello from the express server',
//             app: 'natours-project'
//         });
// });

// app.post('/', (request, response) => {        // root
//     response.status(200).send('post to this end point');
// });

const tourData = JSON.parse(
    fs.readFileSync(database)
);

app.get('/api/v1/tours', (request, response) => {
    response.status(200).json({
        status: 'success',
        results: tourData.length, 
        data: {
            tours: tourData
        }
    })
});

app.post('/api/v1/tours', (request, response) => {
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
});

const port = 3000;
app.listen(port, () => {
    console.log(`app running on port: ${port}`)
});
