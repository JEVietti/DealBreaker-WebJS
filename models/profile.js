const mongoose = require('mongoose')
// require('../config/db')
const Schema = mongoose.Schema
require('../models/images')
var ObjectID = require('mongodb').ObjectID

// Profile Schema houses the data for all profile requests
// This Data includes birthdate, location, name, and more.
const ProfileSchema = mongoose.Schema({

  username: {
    id: '/properties/profile_info/properties/userName',
    type: String,
    upsert: true
  },

  birthdate: {
    id: '/properties/profile_info/properties/birthDate',
    type: String,
    upsert: true
  },

  fname: {
    id: '/properties/profile_info/properties/firstName',
    type: String,
    upsert: true
  },

  lname: {
    id: '/properties/profile_info/properties/lastName',
    type: String,
    upsert: true
  },

  location: {
    upsert: true,
    type: Array,
    country: {
      id: '/properties/profile_info/properties/location',
      type: String,
      upsert: true
    },
    state: {
      id: '/properties/profile_info/properties/location',
      type: String,
      upsert: true
    },
    city: {
      id: '/properties/profile_info/properties/location',
      type: String,
      upsert: true
    }
  },

  sex: {
    id: '/properties/profile_info/properties/sex',
    type: String,
    upsert: true
  },

  sexualOrientation: {
    id: '/properties/profile_info/properties/sexualOrientation',
    type: String,
    upsert: true
  },

  biography: {
    type: String,
    upsert: true
  },

  dealbreakers: [{
    type: String,
    upsert: true
  }],

  goodQualities: [{
    type: String,
    upsert: true
  }],

  badQualities: [{
    type: String,
    upsert: true
  }],

  // Reference to the Images collection
  // in which the data is populated in the get Methods
  images:
  {
    type: Schema.Types.ObjectId,
    ref: 'Images'
  }

})

const Profile = module.exports = mongoose.model('Profile', ProfileSchema)

// Populate the data after query using the same ID
module.exports.getProfileById = function (id, callback) {
  const query = {_id: id}
  Profile.findOne(query).populate('images').lean().exec(callback)
}

// Populate the data of the profile binded to the username,
// the id of the username is then used to populate their images data.
module.exports.getProfileByUsername = function (username, callback) {
  const query = {username: username}
  const data = Profile.findOne(query).populate('images')
  data.lean().exec(callback)
}

// Create method in which the data is saved with the passed in data from request
// in which the callbakc is returned back to the controller
module.exports.create = function (newProfile, callback) {
  newProfile.save(callback)
}

// Update Method
module.exports.update = function (newProfile, callback) {
  Profile.findByIdAndUpdate(newProfile._id, newProfile).exec(callback)
}

// Delete Method: passed the profile/user id which is encoded in the jwt token
// the jwt token is parsed and decoded in the respective controller
module.exports.delete = function (profileID, callback) {
  profileID = new ObjectID(profileID)
  const query = {
    _id: profileID
  }
  console.log(profileID)
  Profile.remove(query, callback)
}
