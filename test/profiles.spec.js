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

const Profile = require('../models/profile')
const config = require('./config-debug.spec')

const mongoose = require('mongoose')

const agent = chai.request.agent(app)

/**
 *
 */
describe('profile', () => {
  const url = 'localhost:8000/api/profile'
  console.log(url)
})

/**
 *
 */
describe('Requesting A Profile that does not exist, with invalid token', () => {
  it('it should get 401', (done) => {
        // expect(res).to.have.property('Authorization', res.body.token)
    agent
      .get('/api/profile/DOESNOTEXIST')
      .set('Authorization', '')
      .end((err, res) => {
        // if (err) console.log(err)
        expect(err).to.have.status(401)
        done()
      })
  })
})

/**
 *
 */
describe('Requesting A Profile that is there own logged in', () => {
  it('it should get 200 if logged in', (done) => {
    agent
      .post('/api/users/auth')
      .send({username: 'dev', password: 'password'})
      .then((res) => {
        // expect(res).to.have.property('Authorization', res.body.token)
        agent
        .get('/api/profile')
        .set('Authorization', res.body.token)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          expect(res).to.have.status(200)
          // console.log(res.body)
          done()
        })
      })
  })
})

/**
 *
 */
describe('Requesting A Profile that does not exist that is not their own', () => {
  it('it should get 404', (done) => {
    agent
      .post('/api/users/auth')
      .send({username: 'dev', password: 'password'})
      .then((res) => {
        // expect(res).to.have.property('Authorization', res.body.token)
        agent
        .get('/api/profile/DOESNOTEXIST')
        .set('Authorization', res.body.token)
        .end((err, res) => {
          // if (err) console.log(err)
          // console.log(res.body)
          expect(res).to.have.status(404)
          done()
        })
      })
  })
})

/**
 *
 */
describe('Create a Profile with Empty Body', () => {
  it('it should get 400 from malformed request', (done) => {
    agent
      .post('/api/users/auth')
      .send({username: 'dev', password: 'password'})
      .then((res) => {
        // expect(res).to.have.property('Authorization', res.body.token)
        agent
          .post('/api/profile')
          .set('Authorization', res.body.token)
          .send({})
          .end((err, res) => {
            // if (err) console.log(err)
            expect(res).to.have.status(400)
            // console.log(res.body)
            done()
          })
      })
  })
})

/**
 *
 */
describe('Create a Profile', () => {
  it('it should get 201 and profile created', (done) => {
    agent
      .post('/api/users/auth')
      .send({username: 'dev', password: 'password'})
      .then((res) => {
        expect(res.body).to.have.property('token')
        agent
          .post('/api/profile')
          .set('Authorization', res.body.token)
          .send({
            fname: 'James',
            lname: 'Cal',
            location: {
              country: 'United States',
              state: 'California',
              city: 'Los Angeles',
              coordinates: [-118.2498, 34.09]
            },
            birthdate: '1990-11-15',
            sex: 'Female',
            sexualOrientation: 'Straight',
            biography: 'BIO',
            seeking: ['seeking'],
            interests: ['seeking'],
            dealbreakers: ['seeking']
          })
          .end((err, res) => {
            if (err) {console.log(err)}
            expect(res).to.have.status(201)
            expect(res.body).to.have.property("success", true)
            // console.log(res.body)
            done()
          })
      })
  })
})

/**
 *
 */
/*
describe('Create a Profile then Get it', () => {
  it('it should get 201 and profile created', done => {
    agent
      .post('/api/users/auth')
      .send({ username: 'dev', password: 'password' })
      .then((res) => {
        const token = res.body.token
        expect(res.body).to.have.property('token')
        const newProfile = {
          _id: '597c03965ceb7d65c4ed42d0',
          images: '597c03965ceb7d65c4ed42d0',
          fname: 'James',
          lname: 'Cal',
          location: {
            country: 'United States',
            state: 'California',
            city: 'Los Angeles',
            coordinates: [-118.2498, 34.049] },
          birthdate: '1990-11-15',
          sex: 'Female',
          sexualOrientation: 'Straight',
          biography: 'BIO',
          seeking: ['seeking'],
          interests: ['seeking'],
          dealbreakers: ['seeking']
        }
        Profile.create(newProfile)
        .then(result => {
          console.log(result)
          agent
            .get('api/profile')
            .set('Authorization', token)
            .end((err, res) => {
              if (err) console.log(err)
              expect(res).to.have.status(200)
              console.log(res.body)
              // expect(res.text).to.have.status(200)
              done()
            })
        })
      })
  })
})

/**
 *
 */

describe('Get Profile By Username after logging in', () => {
  it('Get Profile and Status 200', (done) => {
    agent
       .post('/api/users/auth')
       .send({
         username: 'dev',
         password: 'password'
       })
       .then((res) => {
         agent
       .get('/api/profile/DEV')
       .set(
         'Authorization',
         res.body.token
       )
        .end((err, res) => {
          if (err) {console.log(err)}
          expect(res.body).to.have.property('success', true)
          done()
        })
       })
  })
})

describe('Get Profile By Username after logging in', () => {
  it('Get Profile and Status 200', (done) => {
    agent
      .post('/api/users/auth')
      .send({
        username: 'dev',
        password: 'password'
      })
      .then((res) => {
        agent
          .get('/api/profile')
          .set(
            'Authorization',
            res.body.token
          )
          .end((err, res) => {
            if (err) {
              console.log(err)
            }
            expect(res.body).to.have.property('success', true)
            done()
          })
      })
  })
})

/**
 *
 */
describe('Update a Profile then Get It', () => {
  it('it should get 200 and profile updated', (done) => {
    agent
      .post('/api/users/auth')
      .send({
        username: 'dev',
        password: 'password'
      })
      .then((res) => {
        expect(res.body).to.have.property('token')
        agent
          .put('/api/profile')
          .set('Authorization', res.body.token)
          .send({
            fname: 'James',
            lname: 'Cal',
            location: {
              country: 'United States',
              state: 'California',
              city: 'Los Angeles',
              coordinates: [-118.2498, 34.049]
            },
            birthdate: '1990-11-15',
            sex: 'Female',
            sexualOrientation: 'Straight',
            biography: 'BIO',
            seeking: ['seeking'],
            interests: ['seeking'],
            dealbreakers: ['seeking']
          })
          .end((err, res) => {
            if (err) {console.log(err)}
            expect(res).to.have.status(200)
            // console.log(res.body)
            done()
          })
      })
  })
})
