/**
 *
 */
const mocha = require('mocha')
const describe = mocha.describe
const it = mocha.it
const beforeEach = mocha.beforeEach
const chai = require('chai')
const chaiHttp = require('chai-http')

const app = require('../app')
const should = chai.should()
const expect = chai.expect()
const agent = chai.request.agent(app)

const Users = require('../models/user')
const config = require('./config-debug.spec')
process.env.NODE_ENV = 'test'
const mongoose = require('mongoose')
chai.use(chaiHttp)

Users.findOneAndRemove({username: 'jscal'}).exec()

describe('users', () => {
  const url = 'localhost:8000/api/users'
})

/**
 *
 */
describe('/POST user register without body', () => {
  it('it should get 400 and status failed', (done) => {
    agent
    .post('/api/users')
    .send()
    .end((err, res) => {
      if (err) {
        // console.log(err)
      }
      // console.log(res)
      res.should.have.status(400)
      done()
    })
  })
})

/**
 *
 */
describe('/POST user register a user', () => {
  it('it should be 201 and registered', (done) => {
    agent
    .post('/api/users')
    .send({fname: 'James', lname: 'Cal', birthdate: '1990-11-15', email: 'jscal@gmail.com', username: 'jscal', password: 'password'})
    .end((err, res) => {
      if (err) {
        console.log(err)
      }
      console.log(res.body)
      res.should.have.status(201)
      done()
    })
  })
})

/**
 *
 */
describe('/POST Login a registered user', () => {
  it('it login with correct credentials, 202 status', (done) => {
    agent
    .post('/api/users/auth')
    .send({username: 'jscal', password: 'password'})
    .end((err, res) => {
      if (err) {
        console.log(err)
      }
      console.log(res.body)
      res.should.have.status(202)
      done()
    })
  })
})

/**
 *
 */
/*
describe('/POST Login a registered user', () => {
  it('it login with correct credentials, 202 status', (done) => {
    agent
    .post('/api/users/auth')
    .send({username: 'dev', password: 'password'})
    .end((err, res) => {
      console.log(res.body)
      res.should.have.status(202)
      done()
    })
  })
})
*/
