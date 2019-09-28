const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', error => {
  console.log(`ERROR: ${error.name}, ${error.message}, ${error.stack}`);
  console.log('Uncaught Exception Error! Shutting down...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB connection successful');
  });

// config file counts for all further files
const app = require('./app');

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`app running on port: ${port}`);
});

process.on('unhandledRejection', error => {
  console.log(`ERROR: ${error.name}, ${error.message}`);
  console.log('Unhandled Rejection Error! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
