const express = require('express');
const jsonParser = require('body-parser').json();
const Student = require(__dirname + '/../models/student');
const handleDBError = require(__dirname + '/../lib/handle_db_error');
const basicHTTP = require(__dirname + '/../lib/basic_http');

var studentRouter = module.exports = exports = express.Router();

studentRouter.post('/signup', jsonParser, (req, res) => {
  var newStudent = new Student();
  if (!((req.body.email || '').length && (req.body.password || '').length >7)) {
    return res.status(400).json({msg: 'invalid username or password'});
  }

  Student.count({'authentication.email': req.body.email}, (err, count) => {
    if (err) {
      console.log(err);
      return res.status(400).json({msg: 'Oops!'});
    }

    if (count > 0) {
      return res.status(401).json({msg: 'Email exists already'});
    }
  Student.count({username: req.boy.username}, function(err, countUser) {
      if (err) {
        console.log(err);
        return res.status(400).json({msg: 'Oops!'});
      }

      if (countUser > 0) {
        return res.status(401).json({msg: 'Username already exists!'});
      }
    newStudent.username = req.body.username || req.body.email;
    newStudent.authentication.email = req.body.email;
    newStudent.hashPassword(req.body.password);
    newStudent.save((err, data) => {
      if (err) return handleDBError(err, res);
      res.status(200).json({token: data.generateToken()});
    });
    });  
  });
});

studentRouter.get('/signin', basicHTTP, (req, res) => {
  Student.findOne({'authentication.email': req.basicHTTP.email}, (err, student) => {
    if (err) {
      console.log(err);
      return res.status(401).json({msg: 'authentication failed'});
    }

    if (!student) return res.status(401).json({msg: 'authentication failed'});

    if (!student.comparePassword(req.basicHTTP.password)) return res.status(401).json({msg: 'authentication failed'});

    res.json({token: student.generateToken()});
  });
});

studentRouter.get('/students', (req, res) => {
  Student.find({}, (err, data) => {
    if (err) return handleDBError(err, res);

    res.status(200).json(data);
  });
});

studentRouter.post('/students', jsonParser, (req, res) => {
  var newStudent = new Student(req.body);
  newStudent.save((err, data) => {
    if (err) return handleDBError(err, res);

    res.status(200).json(data);
  });
});

studentRouter.put('/students/:id', jsonParser, (req, res) => {
  var studentData = req.body;
  delete studentData._id;
  Student.update({_id: req.params.id}, studentData, (err, data) => {
    if (err) return handleDBError(err, res);

    res.status(200).json({msg: 'success'});
  });
});


studentRouter.delete('/students/:id', (req, res) => {
  Student.remove({_id: req.params.id}, (err) => {
    if (err) return handleDBError(err, res);

    res.status(200).json({msg: 'success'});
  });
});
