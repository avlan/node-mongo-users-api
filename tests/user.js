const request = require('supertest');
const httpStatus = require('http-status');
const chai = require('chai');
const app = require('../index');
const config = require('../config');

const expect = chai.expect; // eslint-disable-line prefer-destructuring
chai.config.includeStack = true;

describe('## User APIs', () => {
  const user = {
    username: `${+new Date()}@test.com`,
    name: 'Test'
  };
  let createdUser;

  describe(`# POST ${config.basePath}users`, () => {
    it('should create a new user', (done) => {
      request(app)
        .post(`${config.basePath}users`)
        .send(user)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.name).to.equal(user.name);
          createdUser = res.body;
          done();
        })
        .catch(done);
    });
    it('should get error for sending non especified values', (done) => {
      request(app)
        .post(`${config.basePath}users`)
        .send({ name: 'Non valid', nonEspecified: 'something' })
        .expect(httpStatus.BAD_REQUEST)
        .then(() => {
          done();
        })
        .catch(done);
    });
  });

  describe(`# GET ${config.basePath}users/:userId`, () => {
    it('should get user details', (done) => {
      request(app)
        .get(`${config.basePath}users/${createdUser._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(user.name);
          done();
        })
        .catch(done);
    });
    it('should get error for unexisting user', (done) => {
      request(app)
        .get(`${config.basePath}users/000000000000000000000001`)
        .expect(httpStatus.NOT_FOUND)
        .then(() => {
          done();
        })
        .catch(done);
    });
  });

  describe(`# PUT ${config.basePath}users/:userId`, () => {
    it('should get error for sending non especified values', (done) => {
      request(app)
        .put(`${config.basePath}users/${createdUser._id}`)
        .send({ name: 'Non valid', nonEspecified: 'something' })
        .expect(httpStatus.BAD_REQUEST)
        .then(() => {
          done();
        })
        .catch(done);
    });
    it('should update user details', (done) => {
      const newName = 'Another test';
      request(app)
        .put(`${config.basePath}users/${createdUser._id}`)
        .send({ name: newName })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(newName);
          done();
        })
        .catch(done);
    });
    it('should get error for unexisting user', (done) => {
      request(app)
        .put(`${config.basePath}users/000000000000000000000001`)
        .expect(httpStatus.NOT_FOUND)
        .then(() => {
          done();
        })
        .catch(done);
    });
  });

  describe(`# DELETE ${config.basePath}users/:userId`, () => {
    it('should get error for unexisting user', (done) => {
      request(app)
        .delete(`${config.basePath}users/000000000000000000000001`)
        .expect(httpStatus.NOT_FOUND)
        .then(() => {
          done();
        })
        .catch(done);
    });
    it('should delete user', (done) => {
      request(app)
        .delete(`${config.basePath}users/${createdUser._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body._id).to.equal(createdUser._id);
          done();
        })
        .catch(done);
    });
    it('should get not found by trying to delete that user again', (done) => {
      request(app)
        .delete(`${config.basePath}users/${createdUser._id}`)
        .expect(httpStatus.NOT_FOUND)
        .then(() => {
          done();
        })
        .catch(done);
    });
  });
});
