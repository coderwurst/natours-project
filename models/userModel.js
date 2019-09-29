const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    minLength: [8, 'a password must include 8 characters'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'confirmed password is required'],
    validate: {
      // custom validators only work on create and save!
      validator: function(element) {
        return element === this.password;
      },
      message: 'passwords do not match'
    }
  }
});

userSchema.pre('save', async function(next) {
  // only run when password was added / modified
  if (!this.isModified('password')) return next();

  // add salt and hast (cost 12) and delete the no longer needed confirm field
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

// instance method
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = new mongoose.model('User', userSchema);

module.exports = User;
