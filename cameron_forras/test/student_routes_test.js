const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/students_app_test';
const server = require(__dirname + '/../server');
const Student = require(__dirname + '/../models/student');

describe('the students api', () => {
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  it('should be able to retrieve all our students', (done) => {
    chai.request('localhost:3000')
    .get('/api/students')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.eql(true);
      done();
    });
  });

  it('should create a student with a POST', (done) => {
    chai.request('localhost:3000')
      .post('/api/students')
      .send({name: 'test student'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.name).to.eql('test student');
        expect(res.body).to.have.property('_id');
        done();
      });
  });

  describe('rest requests that require a student already in db', () => {
    beforeEach((done) => {
      Student.create({name: 'test student'}, (err, data) => {
        this.testStudent = data;
        done();
      });
    });

    it('should be able to update a student', (done) => {
      chai.request('localhost:3000')
        .put('/api/students/' + this.testStudent._id)
        .send({name: 'new student name'})
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.eql('success');
          done();
        });
    });

    it('should be able to delete a student', (done) => {
      chai.request('localhost:3000')
        .delete('/api/students/' + this.testStudent._id)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.eql('success');
          done();
        });
    });
  });
});
