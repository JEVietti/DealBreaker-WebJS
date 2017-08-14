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

describe('Images', () => {
  const url = 'localhost:8000/api/images'
  console.log(`Images ${url}`)
})

/*

describe('Get pre-signed image url, and upload s3', () => {
  it('Should get pre-signed url then upload', (done) => {

  })
})

describe('Get image gallery after uploading', () => {
  it('Should get a url for image from bucket link and username, filename as key', (done) => {

  })
})

describe("Remove an image from user's gallery", () => {
  it('Should remove the image from the gallery of images')
})
*/
