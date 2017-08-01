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

describe('Rejected', () => {
  const url = 'localhost:8000/api/rejected'
})

describe('Create a Rejected, as rejector and target rejectee', () => {
  it('add target to rejector, and target adds requestor as rejectee list', (done) => {
    agent.post('/api/users/auth')
    .send({username: 'dev', password: 'password'})
    .then((login) => {
      var partnerID = mongoose.Types.ObjectId()
       agent.post("/api/reject")
       .set('Authorization', login.body.token)
       .send({_id: partnerID})
       .end((err, res) => {
         if (err) {
           console.log(err)
         }
         expect(res).to.have.status(201)
         done()
       })
    })
  })
})

describe('Create a Rejected, and get list of users you have rejected', () => {
  it('add target to rejector, and target adds requestor as rejectee list', (done) => {
    agent.post('/api/users/auth')
    .send({username: 'dev', password: 'password'})
    .then((login) => {
      var partnerID = mongoose.Types.ObjectId();
       agent.post("/api/reject").set('Authorization', login.body.token).send({_id: partnerID})
       .then((result) => {
         // expect(result).to.have.status(201)
         agent.get('/api/reject/rejecting')
         .set('Authorization', login.body.token)
         .end((err, res) => {
           if (err) {
             console.log(err.body)
           }
            expect(res).status(200)
            done()
          })
       })
    })
  })
})
