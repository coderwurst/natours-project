const mongoose = require('mongoose');
const dotenv = require('dotenv');

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
/*.catch(error => {
    console.log(`Connection failure: ${error}`);
  });*/

// config file counts for all further files
const app = require('./app');

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('warning', warning => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.stack);
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app running on port: ${port}`);
});
