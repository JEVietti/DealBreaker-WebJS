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

process.env.NODE_ENV = 'test' // set environment to testing

const app = require('../app')
const should = chai.should()
const expect = chai.expect
const assert = chai.assert

const config = require('./config-debug.spec')

const mongoose = require('mongoose')

const agent = chai.request.agent(app)

/**
 *
 */
describe('Confirmed', () => {
  const url = 'localhost:8000/api/confirm'
  console.log(`Endpoint ${url}`)
})

/**
 *
 */
describe('Create a Confirmed Relationship', () => {
  it('Create the Entry in both users Confirmed Lists', (done) => {
  // Login
    agent.post('/api/users/auth')
      .send({
        username: 'dev',
        password: 'password'
      })
      .then((login) => {
        // Create Confirmed
        var partnerID = mongoose.Types.ObjectId()
        agent.post('/api/confirm')
          .set('Authorization', login.body.token)
          .send({ _id: partnerID })
          .end((err, res) => {
            expect(res).to.have.status(201)
            done()
          })
      })
  })
})

/**
 *
 */
describe('Create and Get a Confirmed Relationship ', () => {
  it('Get the Entry in users Confirmed Lists', (done) => {
    // Login
    agent.post('/api/users/auth')
    .send({
      username: 'dev',
      password: 'password'
    })
    .then((login) => {
    // Create Confirmed
      var partnerID = mongoose.Types.ObjectId()
      agent.post('/api/confirm')
      .set('Authorization', login.body.token)
      .send({_id: partnerID})
      .then((result) => {
        expect(result).to.have.status(201)
        // Get the Relationship
        agent.get('/api/confirm')
        .set('Authorization', login.body.token)
        .end((err, res) => {
          if (err) {
            console.log(err.body)
          }
          //console.log(res)
          expect(res).status(200)
          done()
        })
      })
    })
  })
})
