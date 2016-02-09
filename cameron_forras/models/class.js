'use strict';
var mongoose = require('mongoose');

var classSchema = new mongoose.Schema({
  name: String,
  level: Number, 
  professor: String
});

module.exports = exports = mongoose.model('Class', classSchema);
