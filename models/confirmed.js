const mongoose = require('mongoose')
const db = require('../config/db')
const extend = require('mongoose-schema-extend')

var Relationship = require('../models/relationship')

const Schema = mongoose.Schema

const PendingSchema = Relationship.extend({
  status: Number
})
