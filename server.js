const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// config file counts for all further files
const app = require('./app');

console.log(process.env);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app running on port: ${port}`);
});
