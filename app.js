const express = require('express');

const app = express();

// routing app.method.url
app.get('/', (request, response) => {        // root
    response.status(200).send('hello from the express server');
});           


const port = 3000;
app.listen(port, () => {
    console.log(`app running on port: ${port}`)
});
