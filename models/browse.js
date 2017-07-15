const mongoose = require('mongoose')
// require('../config/db')
const Profile = require('../models/profile')
const Schema = mongoose.Schema
/*
const BrowseSchema = mongoose.Schema({
  location: {
    type: String,

    sex: {
      type: String,

      sexualOrientation: {
        type: String,

        profiles: [{
          type: Schema.Types.ObjectId,
          ref: 'Profile'
        }]
      }
    }
  }
})
*/

// Export Model Functions
module.exports.getAll = function (callback) {
  Profile.find().populate('images').lean().exec(callback)
}

module.exports.getMatching = function (pref, callback) {
  Profile.find().populate('images').lean().exec(callback)
}