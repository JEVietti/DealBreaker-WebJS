const mocha = require('mocha')
const describe = mocha.describe
const it = mocha.it
const beforeEach = mocha.beforeEach
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app')
const should = chai.should()

const Users = require('../models/user')
const config = require('./config-debug')
process.env.NODE_ENV = 'test'
const mongoose = require('mongoose')
chai.use(chaiHttp)

Users.collection.drop()

describe('/POST user register without body', () => {
  it('it should get 200 and status failed', (done) => {
    chai.request(server)
    .post('/api/users')
    .send()
    .end((err, res) => {
      // console.log(res)
      res.should.have.status(400)
      done()
    })
  })
})

describe('/POST user register a user', () => {
  it('it should be 201 and registeted', (done) => {
    chai.request(server)
    .post('/api/users')
    .send({fname: 'James', lname: 'Cal', birthdate: '1990-11-15', email: 'jcal@gmail.com', username: 'jscal', password: 'password'})
    .end((err, res) => {
      console.log(res.body)
      res.should.have.status(201)
      done()
    })
  })
})

describe('/POST Login a registered user', () => {
  it('it login with correct credentials, 202 status', (done) => {
    chai.request(server)
    .post('/api/users/auth')
    .send({username: 'jscal', password: 'password'})
    .end((err, res) => {
      console.log(res.body)
      res.should.have.status(202)
      done()
    })
  })
})
