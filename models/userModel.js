const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    maxLength: [40, 'the name must have less than or equal to 40 characters'],
    minLength: [6, 'a tour name must have at least 6 chars']
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'email is not valid']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'password is required'],
    minLength: [8, 'a password must include 8 characters']
  },
  passwordConfirm: {
    type: String,
    required: [true, 'confirmed password is required']
  }
});

const User = new mongoose.model('User', userSchema);

module.exports = User;
