'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  major: { type: String, default: 'Undeclared'},
  cell_number: { 
    type: Number,
    validate: {
      validator: function(v) {
        return /d{3}-d{3}-d{4}/.test(v);
      },
      message: '{VALUE} is not a valid phone number!'
    }
  },
  username: String, 
  authentication: {
    email: String,
    password: String
  }
});

studentSchema.methods.hashPassword = function(password) {
  var hash = this.authentication.password = bcrypt.hashSync(password, 8);
  return hash;
};

studentSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.authentication.password);
};

studentSchema.methods.generateToken = function() {
  return jwt.sign({id: this._id}, process.env.APP_SECRET || 'changethis');
};

module.exports = exports = mongoose.model('Student', studentSchema);
