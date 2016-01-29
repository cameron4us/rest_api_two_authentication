const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/classes_app_test';
const server = require(__dirname + '/../server');
const Class = require(__dirname + '/../models/class');

describe('the classes api', () => {
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  it('should be able to retrieve all our classes', (done) => {
    chai.request('localhost:3000')
    .get('/api/classes')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.eql(true);
      done();
    });
  });

  it('should create a class with a POST', (done) => {
    chai.request('localhost:3000')
      .post('/api/classes')
      .send({name: 'test class', level: '101', professor: 'Bob'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.name).to.eql('test class', '101', 'Bob');
        expect(res.body).to.have.property('_id');
        done();
      });
  });

  describe('rest requests that require a class already in db', () => {
    beforeEach((done) => {
      Class.create({name: 'test class' , level: '101', professor: 'Bob'}, (err, data) => {
        this.testClass = data;
        done();
      });
    });

    it('should be able to update a class', (done) => {
      chai.request('localhost:3000')
        .put('/api/classes/' + this.testClass._id)
        .send({name: 'new class name', level: '201', professor: 'Bobby Joe'})
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.eql('success');
          done();
        });
    });

    it('should be able to delete a class', (done) => {
      chai.request('localhost:3000')
        .delete('/api/classes/' + this.testClass._id)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.eql('success');
          done();
        });
    });
  });
});
