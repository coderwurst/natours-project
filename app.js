const express = require('express');

const app = express();

// routing app.http-method.url
app.get('/', (request, response) => {        // root
    response
    .status(200)
    .json(
        {   message: 'hello from the express server',
            app: 'natours-project'
        });
});

app.post('/', (request, response) => {        // root
    response.status(200).send('post to this end point');
});

const port = 3000;
app.listen(port, () => {
    console.log(`app running on port: ${port}`)
});
