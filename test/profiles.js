const mocha = require('mocha')
const describe = mocha.describe
const it = mocha.it
const beforeEach = mocha.beforeEach
const chai = require('chai')
const chaiHttp = require('chai-http')
process.env.NODE_ENV = 'test'

const server = require('../app')
const should = chai.should()

const Profile = require('../models/profile')
const config = require('./config-debug')

const mongoose = require('mongoose')
chai.use(chaiHttp)

describe('profile', () => {
  const url = 'localhost:8000'
  beforeEach((done) => {
    // In our tests we use the test db
    Profile.remove()
    done()
  })
})

describe('/GET profile', () => {
  it('it should get 401 if not logged in', (done) => {
    chai.request(server)
    .get('/api/profile')
    .end((err, res) => {
     // console.log(res)
      res.should.have.status(401)
      done()
    })
  })
})
