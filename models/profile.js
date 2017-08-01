/** Profile Model
 *
 */
let mongoose = require('mongoose')
const bluebird = require('bluebird')
mongoose = bluebird.promisifyAll(mongoose)
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
    type: Object,
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
    },
    coordinates: {type: "Point", default: [0, 0]}
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

  interests: [{
    type: String,
    upsert: true
  }],

  seeking: [{
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
ProfileSchema.index({location: {coordinates: '2dsphere'} })

const Profile = module.exports = mongoose.model('Profile', ProfileSchema)

/** Get Profile
 * Populate Gallery of Images from Images Model
 * @param {*} id
 */
function getProfileById (id) {
  return Profile.findById(id).populate('images').lean().exec()
}

/** Populate the data of the profile bound to the username,
 * the id of the username is then used to populate their images data.
 * @param {*} username
 */
function getProfileByUsername (username) {
  const query = {username: username}
  return Profile.findOne(query).populate('images').lean().exec()
}

/** Profile Creation
 * Create method in which the data is saved with the passed in data from request
 * @param {Object} newProfile
 */
function createProfile (newProfile) {
  return Profile.findByIdAndUpdate(newProfile._id, newProfile, {upsert: true, safe: true}).exec()
}

/**
 *
 * @param {ObjectId(String) || String} id
 * @param {Object} newProfile
 */
function updateProfile (id, newProfile) {
  return Profile.findByIdAndUpdate(id, newProfile).exec()
}

/** Delete Method: passed the profile/user id which is encoded in the jwt token
 * the jwt token is parsed and decoded in the respective controller
 *
 * @param {*} profileID
 */
function deleteProfile (profileID) {
  profileID = new ObjectID(profileID)
  const query = {
    _id: profileID
  }
  return Profile.remove(query).exec()
}

/** Exporting Functions defined above
 *  Format: module.export.exportName = functionName
*/
module.exports.getProfileById = getProfileById
module.exports.getProfileByUsername = getProfileByUsername
module.exports.create = createProfile
module.exports.update = updateProfile
module.exports.delete = deleteProfile
