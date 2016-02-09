'use strict';
const Student = require(__dirname + '/../models/student');
const jwt = require('jsonwebtoken');

module.exports = exports = function(req, res, next) {
  var decoded;
  try {
    decoded = jwt.verify(req.headers.token, process.env.APP_SECRET || 'changethis');
  } catch(e) {
    return res.status(401).json({msg: 'authentication error'});
  }
  Student.findOne({_id: decoded.id}, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(401).json({msg: 'authentication error'});
    }

    if (!Student) res.status(401).json({msg: 'authentication error'});

    req.user = user;
    next();
  });
};
