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
  .then(() => console.log('DB connection successful'));

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'price must be provided']
  }
});

const Tour = new mongoose.model('Tour', tourSchema);

// config file counts for all further files
const app = require('./app');

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app running on port: ${port}`);
});
