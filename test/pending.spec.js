/**
 *
 */
global.Promise = require('bluebird')
var chai = require('chai')
chai.use(require('chai-http'))

const mocha = require('mocha')
const describe = mocha.describe
const it = mocha.it
const beforeEach = mocha.beforeEach

process.env.NODE_ENV = 'test'

const app = require('../app')
const should = chai.should()
const expect = chai.expect
const assert = chai.assert

const config = require('./config-debug.spec')

const mongoose = require('mongoose')

const agent = chai.request.agent(app)

describe('Pending', () => {
  const url = 'localhost:8000/api/pending'
})

/**
 * 
 */
describe('Create Pending Request with empty body', () => {
  it('Should response 400, with failure message', (done) => {
    agent
      .post("/api/users/auth")
      .send({username: "dev", password: "password"})
      .then((login) => {
        // Create Confirmed
        agent
          .post("/api/pending")
          .send({})
          .set("Authorization", login.body.token)
          .end((err, res) => {
            if (err) {
              // console.log(err.body)
              expect(err).to.have.status(400);
            }
            done()
          });
      });
  })
})

/**
 * 
 */
describe("Create Pending Request to a User", () => {
  it("Should response 201, with success message", done => {
    agent
      .post("/api/users/auth")
      .send({ username: "dev", password: "password" })
      .then(login => {
        // Create Confirmed
        var partnerID = mongoose.Types.ObjectId();
        agent
          .post("/api/pending")
          .send({ _id: partnerID })
          .set("Authorization", login.body.token)
          .end((err, res) => {
            if (err) {
              console.log(err.body);
            }
            expect(res).to.have.status(201);
            done()
          });
      });
  });
});

/**
 * 
 */
describe('Create Pending Request to then get request list to others', () => {
  it('Should response 200, with success message', (done) => {
    agent
      .post("/api/users/auth")
      .send({username: "dev", password: "password"})
      .then((login) => {
        var partnerID = mongoose.Types.ObjectId()
        agent
          .post("/api/pending/requested")
          .send({_id: partnerID})
          .set("Authorization", login.body.token)
          .end((err, res) => {
            if (err) {
              console.log(err.body)
            }
            console.log(res.body)
            expect(res).to.have.status(201);
            done()
          });
      });
  })
})

/**
 * 
 */
describe('Get list of requests to user', () => {
  it('Should response 201, with list of the user', (done) => {
    agent
      .post("/api/users/auth")
      .send({username: "dev", password: "password"})
      .then((login) => {
        var partnerID = mongoose.Types.ObjectId();
        agent
          .post("/api/pending/requests")
          .send({_id: partnerID})
          .set("Authorization", login.body.token)
          .end((err, res) => {
            if (err) {
              console.log(err.body)
            }
            console.log(res.body)
            expect(res).to.have.status(201)
            done()
          })
      })
  })
})

/**
 * 
 */
describe('Remove Pending Request to a User then get lists of requests', () => {
  it('Should response 200, with empty list', (done) => {
    agent
      .post("/api/users/auth")
      .send({username: "dev", password: "password"})
      .then((login) => {
        agent
          .put("/api/pending")
          .set("Authorization", login.body.token)
          .end((err, res) => {
            if (err) {
              console.log(err.body)
            }
            expect(res).to.have.status(200)
            done()
          })
      })
  })
})
