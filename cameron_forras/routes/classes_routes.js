'use strict';
const express = require('express');
const jsonParser = require('body-parser').json();
const Class = require(__dirname + '/../models/class');
const handleDBError = require(__dirname + '/../lib/handle_db_error');
const jwtAuth = require(__dirname + '/../lib/jwt_auth');

var classRouter = module.exports = exports = express.Router();

classRouter.get('/classes', (req, res) => {
  Class.find({}, (err, data) => {
    if (err) return handleDBError(err, res);

    res.status(200).json(data);
  });
});

classRouter.get('/myclasses', jwtAuth, (req, res) => {
  Class.find({name: req.user._id}, (err, data) => {
    if (err) return handleDBError(err, res);

    res.status(200).json(data);
  });

});

classRouter.post('/myclasses', jwtAuth, jsonParser, (req, res) => {
  var newClass = new Class(req.body);
  newClass.name = req.user._id;
  newClass.save((err, data) => {
    if (err) return handleDBError(err, res);

    res.status(200).json(data);
  });
});

classRouter.post('/classes', jsonParser, (req, res) => {
  var newClass = new Class(req.body);
  newClass.save((err, data) => {
    if (err) return handleDBError(err, res);

    res.status(200).json(data);
  });
});

classRouter.put('/classes/:id', jsonParser, (req, res) => {
  var classData = req.body;
  delete classData._id;
  Class.update({_id: req.params.id}, classData, (err, data) => {
    if (err) return handleDBError(err, res);

    res.status(200).json({msg: 'success'});
  });
});


classRouter.delete('/classes/:id', (req, res) => {
  Class.remove({_id: req.params.id}, (err) => {
    if (err) return handleDBError(err, res);

    res.status(200).json({msg: 'success'});
  });
});
