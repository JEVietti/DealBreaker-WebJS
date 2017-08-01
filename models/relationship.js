const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
require('../config/db')

const Schema = mongoose.Schema

const RelationshipSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
  matches: [{
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }]

})

const Relationship = module.exports = mongoose.model('Relationship', RelationshipSchema)
