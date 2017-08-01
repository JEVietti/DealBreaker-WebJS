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

process.env.NODE_ENV = 'test';

const app = require('../app')
const should = chai.should()
const expect = chai.expect
const assert = chai.assert

const config = require('./config-debug.spec')

const mongoose = require('mongoose')

const agent = chai.request.agent(app)

describe('Browse', () => {
  const url = 'localhost:8000/api/browse'
  console.log(`Browse ${url}`)
})
